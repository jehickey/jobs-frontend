import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private base = window.location.origin;
  private portBase = this.base.replace(/:\d+$/, ':8081');
  private apiBase = this.base + "/api";

  public sessionId = signal<string | null>(null);
  public loggedIn = signal(false);
  public userId = signal(0);
  public realName = signal('');
  public email = signal('');

  private http = inject(HttpClient);

  constructor(private router: Router) {
    // Load saved session on startup
    const saved = localStorage.getItem('sessionId');
    if (saved) {
      //this.sessionId.set(saved);
      this.setSession(saved);
    }
  }


  //Sets the local session id, gets user info from service, and shows them as logged in
  setSession(id: string) {
    localStorage.setItem('sessionId', id);
    this.sessionId.set(id);
    this.getSessionInfo();
    this.loggedIn.set(true);
    console.log("Iniated SessionID " + id + " (user:" + this.userId + ")");
  }

  //Terminates the local session and clears all info
  clearSession() {
    localStorage.removeItem('sessionId');
    this.sessionId.set(null);
    this.loggedIn.set(false);
    this.userId.set(0);
    this.realName.set('');
    this.email.set('');
  }

  setUserInfo(setid: number, setemail: string, setname: string) {
    this.userId.set(setid);
    this.email.set(setemail);
    this.realName.set(setname);
  }

  //Gets session info from the service
  getSessionInfo() {
    this.http.get<any>(`${this.portBase}/session`, {
      headers: { 'X-SessionId': this.sessionId() ?? '' }
    }).subscribe({
      next: info => {
        this.setUserInfo(info.userId, info.userName, info.name);
      },
      error: err => {
        console.log("Session invalid: " + err);
        this.clearSession();
      }
    })
  }

  logout() {
    // Optional: tell backend to invalidate session
    this.http.post(`${this.portBase}/logout`, {}, {
      headers: { 'X-SessionId': this.sessionId() ?? '' }
    }).subscribe({
      next: () => { },
      error: () => { }
    });

    // Clear local state
    this.clearSession();

    // Redirect to home
    this.router.navigate(['/']);
  }



}
