import { Component } from '@angular/core';
import { Input, Optional, Host, SkipSelf } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../services/application-service';
import { OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../services/settings-service';

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf],
  templateUrl: './field.html',
  styleUrls: ['./field.scss']
})
export class Field implements OnDestroy {

  @Input() controlName!: string;
  @Input() label = '';
  @Input() type: 'text' | 'textarea' | 'select' | 'checkbox' | 'custom' = 'text';

  @Input() options: any[] = [];
  @Input() optionLabel = '';
  @Input() optionValue = '';

  control!: FormControl;
  pending = false;
  error = false;

  private debounceTimer: any;
  private sub?: Subscription;

  constructor(
    @Optional() @Host() @SkipSelf() private parentForm: FormGroupDirective,
    private cdr: ChangeDetectorRef,
    private appService: ApplicationService,
    private settings: SettingsService,
  ) { }

  ngAfterViewInit() {
    // Resolve the control AFTER Angular builds the form tree
    queueMicrotask(() => {
      this.control = this.parentForm.form.get(this.controlName) as FormControl;

      if (!this.control) {
        console.error(`app-field: Could not find control '${this.controlName}'`);
        return;
      }

      // Now that control exists, set up subscription
      this.sub = this.control.valueChanges.subscribe(value => {
        if (!this.control.dirty) return;

        if (this.debounceTimer) clearTimeout(this.debounceTimer);

        this.debounceTimer = setTimeout(() => {
          this.pending = true;
          this.error = false;

          const id = this.parentForm.form.value.id;

          this.appService.updateField(id, this.controlName, value).subscribe({
            next: () => {
              this.pending = false;
              this.control.markAsPristine();
              this.cdr.detectChanges();
            },
            error: () => {
              this.pending = false;
              this.error = true;
              this.cdr.detectChanges();
            }
          });

        }, this.settings.autosaveDelay);
      });

      // Trigger initial render now that control exists
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }
}