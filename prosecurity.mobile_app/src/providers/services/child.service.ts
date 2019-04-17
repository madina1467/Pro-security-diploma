import {Injectable} from '@angular/core';
import {Api} from "../index";
import {ChildEvents} from "../../model/ChildEvents";
import {EventFilter} from "../../model/EventFilter";
import {USERNAME} from "../auth/auth.metadata";
import {Storage} from "@ionic/storage";
import {Child} from "../../model/Child";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class ChildService {
  constructor(private http: Api, private storage: Storage) {
  }

  public loading: boolean = false;
  public allChildrenEventList: ChildEvents[] = [];
  public filter: EventFilter = new EventFilter();
  public parentChildList: Child[] = [];

  readonly parentChildListValueChanges$ = new BehaviorSubject([]);

  loadEvents() {
    this.filter.limit = 5;
    this.filter.startDate = new Date("2006-01-26");
    this.filter.endDate = new Date();

    console.log('Call child/listAllEvents:');
    this.http.get("child/listAllEvents",
      {parentId: 1, filter: JSON.stringify(this.filter)})
      .toPromise()
      .then(resp => {
        console.log('Response from server child/listAllEvents:', resp);
        if (!resp) {
          return [];
        }
        this.allChildrenEventList = (resp as ChildEvents[]).map((r) => ChildEvents.create(r));
        return this.allChildrenEventList;
      });
  }

  getParentChildren(username: string): Promise<Child[]> {
    console.log('Call child/getMyChildren username: ', username);
    return this.http.get('child/getMyChildren', {username: username})
      .toPromise().then(resp => {
        console.log("Response from child/getMyChildren:  ", resp);
        if (!resp)
          console.error(resp)
        return (<any> resp).map((r) =>
          Child.create(r)
        );
      });
  }

  loadParentChildren() {
    this.loading = true;
    this.storage.get(USERNAME)
      .then((val) => {
        return this.getParentChildren(val)
          .then(result => this.parentChildList = result)
          .then(() => this.parentChildListValueChanges$.next(this.parentChildList))
          .catch(error => {
            console.error("Произошла ошибка при загрузки данный сессии");
            return [];
          });
      })
  }

  load() {
    this.loadParentChildren();
    this.loadEvents();
  }
}
