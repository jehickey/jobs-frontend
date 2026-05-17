import { Component } from '@angular/core';
import { AppsForm } from "./apps-form/apps-form";
import { AppsList } from './apps-list/apps-list';

@Component({
  selector: 'app-apps-page',
  imports: [AppsForm, AppsList],
  templateUrl: './apps-page.html',
  styleUrl: './apps-page.scss',
})
export class AppsPage {

  selectedId = 0;
  onAppSelected(id: number) {
    this.selectedId = id;
  }

}
