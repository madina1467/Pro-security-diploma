import {Component, OnInit} from '@angular/core';
import {LocalDataSource} from "ng2-smart-table";
import {SmartTableData} from "../../../../core/data/smart-table";
import {ParentService} from "../../../../core/services/parent.service";
import {NbDialogService} from "@nebular/theme";
import {ChildEditComponent} from "./child-edit/child-edit.component";
import {Child} from "../../../../core/model/Child";

@Component({
  selector: 'app-child-details',
  templateUrl: './child-details.component.html',
  styleUrls: ['./child-details.component.scss']
})
export class ChildDetailsComponent implements OnInit {


  source: LocalDataSource = new LocalDataSource();

  children: [];
  settings = {
    hideSubHeader: true,
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right'
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      fio: {
        title: 'Child FIO',
        type: 'string',
      },
      gender: {
        title: 'Gender',
        type: 'option',
        editable: false,
      },
      birthDate: {
        title: 'Birth Date',
        type: 'date',
        editable: false,
      },
    },
  };

  constructor(private service: SmartTableData, private parentService: ParentService,
              private dialogService: NbDialogService) {
    this.parentService.getChildList().then(
      res=>{
        res.splice(0, 1);
        this.source.load(res);
      }
    );
  }

  ngOnInit() {
  }


  open(child: Child) {
    this.dialogService.open(ChildEditComponent, {
      context: {
        child: child,
      },
    })
      .onClose.subscribe(res=>{
        console.log("Submit answer", res);
      }
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }


  onCustom(event) {
    this.open(event.data)
    // alert(`Custom event '${event.action}' fired on row №: ${event.data.id}`);
    console.log('Selected Child: ', event);
  }
}
