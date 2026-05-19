import { Component } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { inject } from '@angular/core';
import { ApplicationData } from '../../models/ApplicationData';
import { ApplicationListData } from '../../models/ApplicationListData';
import { NgForOf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Input, Output } from '@angular/core';
import { CdkRow } from '@angular/cdk/table';
import { signal } from '@angular/core';
import { Signal } from '@angular/core';
import { effect } from '@angular/core';

@Component({
  selector: 'app-apps-list',
  imports: [NgForOf],
  templateUrl: './apps-list.html',
  styleUrl: './apps-list.scss',
})
export class AppsList {

  private appService = inject(ApplicationService);
  applications = signal<ApplicationListData[]>([]);
  selectedId = 0;

  private _refreshTrigger !: Signal<number>;
  @Input() set refreshTrigger(value: Signal<number>) {
    console.log("RefreshTrigger set to " + value);
    this._refreshTrigger = value;
  }
  lastRefresh = 0;
  @Output() selected = new EventEmitter<number>();

  constructor() {
    this.loadList();

    effect(() => {
      console.log("Reset effect started");
      //if (!this.refreshTrigger) return;
      const v = this._refreshTrigger();
      console.log("Reset effect running: got #" + v);
      if (v > this.lastRefresh) {
        this.lastRefresh = v;
        console.log("Signal is good!");
        queueMicrotask(() => this.loadList());
      }
    });



  }





  select(app: ApplicationListData) {
    this.selectedId = app.id;
    console.log("Load app " + app.id);
    this.selected.emit(app.id);
  }

  ngOnInit() {
    //console.log("AppsList ngOnInit fired");
    //this.loadList();
  }

  loadList() {
    this.appService.listApplications().subscribe(list => {
      this.applications.set(list);
      console.log(list);
    });

  }
}
