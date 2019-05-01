import {Injectable} from '@angular/core';
import {Api} from "../index";
import {EventList} from "../../model/EventList";
import {EventFilter} from "../../model/EventFilter";
import {Storage} from "@ionic/storage";
import {Child} from "../../model/Child";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class ChildService {
  constructor(private http: Api, private storage: Storage) {
  }

  public loading: boolean = false;
  public filter: EventFilter = new EventFilter();
  readonly parentChildListValueChanges$ = new BehaviorSubject([]);
  readonly allChildrenEventListValueChanges$ = new BehaviorSubject([]);

  loadEvents(childId : number) {
    this.filter.childId = childId;
    this.filter.limit = 15;
    this.filter.startDate = new Date("2006-01-26");
    this.filter.endDate = new Date();

    console.log('Call child/listAllEvents: parent - 1(static)', 'filter - ', this.filter);
    this.http.get("child/listAllEvents",
      {parentId: 1, filter: JSON.stringify(this.filter)})
      .toPromise()
      .then(resp => {
        console.log('Response from server child/listAllEvents:', resp);
        if (!resp) {
          return [];
        }
        this.allChildrenEventListValueChanges$.next((resp as EventList[]).map((r) => EventList.create(r)));
      });
  }

  getParentChildren(): Promise<Child[]> {
    console.log('Call child/getChildList username: ');
    return this.http.get('child/getChildList')
      .toPromise().then(resp => {
        console.log("Response from child/getChildList:  ", resp);
        if (!resp)
          console.error(resp)
        return (<any> resp).map((r) =>
          Child.create(r)
        );
      });
  }

  loadParentChildren() {
    this.loading = true;
        return this.getParentChildren()
          .then(result => this.parentChildListValueChanges$.next(result))
          .catch(error => {
            console.error("Произошла ошибка при загрузки данный сессии");
            return [];
          });
  }

  load(childId : number) {
    this.loadParentChildren();
    this.loadEvents(childId);
  }
}
