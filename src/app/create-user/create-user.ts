import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UserService } from '../services/user';

import { ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule

  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.scss'
})
export class CreateUser {

  private userService = inject(UserService);

  usernameAvailable: boolean | null = null;
  serverError: string | null = null;

  form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    userName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  constructor(private cdr: ChangeDetectorRef) {
    // Live username availability check
    this.form.controls.userName.valueChanges
      .pipe(
        tap(() => this.usernameAvailable = null),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(userName => this.userService.checkNameAvailable(userName))
      )
      .subscribe({
        next: available => {
          //console.log("status: " + available);
          this.usernameAvailable = !available;
          this.cdr.detectChanges();
        },
        error: () => this.usernameAvailable = null
      });
  }

  submit() {
    this.serverError = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userService.createUser(this.form.getRawValue()).subscribe({
      next: () => {
        // success — maybe redirect or show a message
      },
      error: err => {
        this.serverError = err.error?.message ?? 'Unknown error creating user';
      }
    });
  }
}