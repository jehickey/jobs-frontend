import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationData } from '../models/ApplicationData';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private base = window.location.origin;
  private portBase = this.base.replace(/:\d+$/, ':8081');
  private apiBase = this.base + "/api";

  constructor(private http: HttpClient) { }

  getApplication(id: number) {
    return this.http.get<ApplicationData>(`${this.base}/applications/${id}`);
  }

  saveApplication(app: ApplicationData) {
    return this.http.post(`${this.base}/applications`, app);
  }

  updateField(id: number, field: string, value: any) {
    return this.http.patch(`${this.base}/applications/${id}/${field}`, { value });
  }

  deleteApplication(id: number) {
    return this.http.delete(`${this.base}/applications/${id}`);
  }


}
