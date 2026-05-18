import { Component, input } from '@angular/core';
import { Input, Output, Optional, Host, SkipSelf, HostBinding } from '@angular/core';
import { FormControl, FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApplicationService } from '../services/application-service';
import { OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../services/settings-service';
import { EventEmitter } from '@angular/core';

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

  @Input() backgroundColor = '';

  @Input() listEndpoint?: string;
  @Input() createEndpoint?: string;
  @Input() allowCreate = false;

  @Input() allowIncrement = false;


  @Input() options: any[] = [];
  @Input() optionLabel = '';
  @Input() optionValue = '';

  control!: FormControl;
  pending = false;
  error = false;

  @Output() colorChange = new EventEmitter<string>();
  selectedColor = '';

  private debounceTimer: any;
  private sub?: Subscription;

  constructor(
    @Optional() @Host() @SkipSelf() private parentForm: FormGroupDirective,
    private cdr: ChangeDetectorRef,
    private appService: ApplicationService,
    private settings: SettingsService,
  ) { }

  ngAfterViewInit() {

    if (this.type == "select" && this.listEndpoint) {
      this.appService.getList(this.listEndpoint).subscribe(list => {
        this.options = list;
        this.updateSelectedColor();
        this.cdr.detectChanges();
      });
    }

    // Resolve the control AFTER Angular builds the form tree
    queueMicrotask(() => {
      this.control = this.parentForm.form.get(this.controlName) as FormControl;

      if (!this.control) {
        console.error(`app-field: Could not find control '${this.controlName}'`);
        return;
      }

      // Now that control exists, set up subscription
      this.sub = this.control.valueChanges.subscribe(value => {
        this.updateSelectedColor();
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


  reset() {
    this.pending = false;
    this.error = false;
    clearTimeout(this.debounceTimer);
    this.control?.markAsPristine();
    this.cdr.detectChanges();
  }

  private updateSelectedColor() {
    if (this.type != "select") return;
    const id = this.control?.value;
    const opt = this.options.find(o => o.id == id);
    if (opt) {
      if (opt.color == '') opt.color = "#FFFFFF";
      this.selectedColor = opt.color;
      this.colorChange.emit(this.selectedColor);
    }
  }

  onDblClickSelect() {
    if (!this.allowIncrement) return;
    if (!this.options || !this.control) return;

    const currentId = this.control.value;
    const index = this.options.findIndex(o => o.id == currentId);

    if (index === -1) return;

    const nextIndex = (index + 1) % this.options.length;
    const next = this.options[nextIndex];

    this.control.setValue(next.id);
  }

}