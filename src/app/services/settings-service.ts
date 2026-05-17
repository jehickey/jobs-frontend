import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  autosaveDelay = 1000;

  //not implemented yet, made for when it gets settings from db
  loadFromServer(config: any) {
    this.autosaveDelay = config.autosaveDelay;
  }


}
