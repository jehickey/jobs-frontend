import { Component } from '@angular/core';
import { ApplicationService } from '../../services/application-service';
import { inject } from '@angular/core';
import { ApplicationData } from '../../models/ApplicationData';
import { NgForOf } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { CdkRow } from '@angular/cdk/table';
import { signal } from '@angular/core';

@Component({
  selector: 'app-apps-list',
  imports: [NgForOf],
  templateUrl: './apps-list.html',
  styleUrl: './apps-list.scss',
})
export class AppsList {

  private appService = inject(ApplicationService);
  applications = signal<ApplicationData[]>([]);
  selectedId = 0;
  @Output() selected = new EventEmitter<number>();

  constructor() {
    this.loadList();
  }

  select(app: ApplicationData) {
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
