import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class UserService {
  private base = window.location.origin;
  private portBase = this.base.replace(/:\d+$/, ':8081');
  private apiBase = this.base + "/api";


  private http = inject(HttpClient);

  // Check if a username is available
  checkNameAvailable(name: string): Observable<boolean> {
    //var result = this.http.get<boolean>(`${this.portBase}/users/exists?username=${encodeURIComponent(name)}`);
    return this.http.get<boolean>(`${this.portBase}/users/exists?username=${encodeURIComponent(name)}`);
  }

  // Create a new user
  createUser(data: {
    name: string;
    userName: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.portBase}/users`, data);
  }
}

