import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  autosaveDelay = 500;

  //not implemented yet, made for when it gets settings from db
  loadFromServer(config: any) {
    this.autosaveDelay = config.autosaveDelay;
  }


}
