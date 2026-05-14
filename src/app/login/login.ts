import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  email = signal('');
  password = signal('');
  result = signal("ready");
  label = "Alpha";

  constructor(private http: HttpClient) { }

  onSubmit(event: Event) {
    event.preventDefault();  //stop page reload
    console.log('Email:', this.email());
    console.log('Password:', this.password());
    this.result.set("in progress...");

    const body = {
      email: this.email(),
      password: this.password(),
    };

    this.http.post('http://jobs.ehickey.com:8081/login', body)
      .subscribe({
        next: (response) => {
          this.result.set("good");
          console.log('Login success', response);
        },
        error: (err) => {
          this.result.set(`Failed: ${this.label}`);
          console.log('Login error:', err);
        },
        complete: () => {
          this.result.set("Done!");
          console.log('Post-Login operations here');
        }
      });

  }


}