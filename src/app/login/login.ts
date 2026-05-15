import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth-service';
import { Router, RouterLink } from "@angular/router";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterLink, NgIf],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  email = signal('');
  password = signal('');
  failed = false;
  failReason = signal('');
  buttonText = signal('Sign In');

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  onSubmit(event: Event) {
    event.preventDefault();  //stop page reload
    //console.log('Email:', this.email());
    //console.log('Password:', this.password());
    this.failed = false;
    this.buttonText.set('Signing In...');



    const body = {
      userName: this.email(),
      password: this.password(),
    };

    if (this.email() == "") {
      this.failed = true;
      this.failReason.set("Email required");
      return;
    }

    if (this.password() == "") {
      this.failed = true;
      this.failReason.set("Password required");
      return;
    }


    if (!this.failed) {
      this.http.post('http://jobs.ehickey.com:8081/login', body)
        .subscribe({
          next: (response) => {
            this.failed = false;
            this.buttonText.set('Done!');
            this.auth.setSession(response.toString());
            //console.log('Login success', response.toString());
          },
          error: (err) => {
            console.log('Login error:', err.error);
            this.failed = true;
            this.failReason.set(err.error);
            this.password.set('');
            this.buttonText.set('Sign In');
          },
          complete: () => {
            console.log('Login success');
            this.buttonText.set('Done!');
            this.router.navigate(['/']);
          }
        });
    }

  }


}