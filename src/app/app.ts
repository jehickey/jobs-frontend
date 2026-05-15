import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Topbar } from "./topbar/topbar";

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, Topbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('jobs-ui');
}
