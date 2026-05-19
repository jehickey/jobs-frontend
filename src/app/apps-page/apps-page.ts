import { Component, signal } from '@angular/core';
import { AppsForm } from "./apps-form/apps-form";
import { AppsList } from './apps-list/apps-list';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-apps-page',
  imports: [AppsForm, AppsList],
  templateUrl: './apps-page.html',
  styleUrl: './apps-page.scss',
})
export class AppsPage {

  public refreshList = signal(0);
  refreshCounter = 0;

  selectedId = 0;
  onAppSelected(id: number) {
    this.selectedId = id;
  }


  /*
    triggerListRefresh() {
      console.log("List refresh from page triggered");
      this.refreshCounter++;
      this.refreshList.set(this.refreshCounter);
    }
    */

  onRefreshList() {
    this.refreshCounter++;
    console.log("Calling list refresh from page (counter" + this.refreshCounter + ")");
    this.refreshList.set(this.refreshCounter);
  }

}
