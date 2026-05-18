import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApplicationData } from '../models/ApplicationData';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private base = window.location.origin;
  private portBase = this.base.replace(/:\d+$/, ':8081');
  private apiBase = this.base + "/api";

  constructor(private http: HttpClient, private auth: AuthService) { }

  // backend returns: [ { id:number, label:string } ]
  getList(endpoint: string) {
    return this.http.get<any[]>(`${this.portBase}${endpoint}`, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }



  listApplications() {
    return this.http.get<ApplicationData[]>(`${this.portBase}/applications`, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }

  createApplication() {
    return this.http.post<{ applicationId: number }>(`${this.portBase}/applications`, {}, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }

  getApplication(id: number) {
    return this.http.get<ApplicationData>(`${this.portBase}/applications/${id}`, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }

  saveApplication(app: ApplicationData) {
    return this.http.post(`${this.portBase}/applications`, app, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }

  updateField(id: number, field: string, value: any) {
    return this.http.patch(`${this.portBase}/applications/${id}/${field}`, { value }, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }

  deleteApplication(id: number) {
    return this.http.delete(`${this.portBase}/applications/${id}`, {
      headers: { 'X-SessionId': this.auth.sessionId() ?? '' }
    });
  }


}
