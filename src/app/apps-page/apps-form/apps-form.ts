import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationData, NewApplicationData } from '../../models/ApplicationData';
import { ApplicationService } from '../../services/application-service';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings-service';
import { FocusNext } from '@angular/cdk/menu';
import { Field } from "../../field/field";


@Component({
  selector: 'app-apps-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Field],
  templateUrl: './apps-form.html',
  styleUrl: './apps-form.scss',
})
export class AppsForm {

  dateApplied = signal('')
  //data!: ApplicationData;

  form!: FormGroup;
  data = signal<ApplicationData>(NewApplicationData());

  changed: Record<string, boolean> = {};
  pending: Record<string, boolean> = {};
  error: Record<string, boolean> = {};
  private debounceTimers: Record<string, any> = {};

  @Input() applicationId = 0;

  constructor(
    private fb: FormBuilder,
    private appService: ApplicationService,
    private settings: SettingsService,
    private cdr: ChangeDetectorRef,
  ) {



    this.form = this.fb.group({
      id: this.fb.control<number>(0),
      position: this.fb.control<string>(''),
      statusId: this.fb.control<number>(0),
      organization: this.fb.control(''),
      dateApplied: this.fb.control(0),
      lastResponse: this.fb.control(0),
      url: this.fb.control(''),
      siteUser: this.fb.control(''),
      sitePass: this.fb.control(''),
      sourceId: this.fb.control(0),
      jobPosting: this.fb.control(''),
      notes: this.fb.control(''),
    });

    //this.form.get('position')!.valueChanges.subscribe(value => {
    //  this.appService.updateField(0, 'position', value).subscribe();
    //});

    this.loadApplication(0);

    this.form.valueChanges.subscribe(() => {
      for (const key of Object.keys(this.form.controls)) {
        const control = this.form.get(key)!;
        if (control.dirty)
          if (control.dirty && !this.pending[key]) {
            //reset any existing update timer
            if (this.debounceTimers[key]) {
              clearTimeout(this.debounceTimers[key]);
            }
            //set a new debounce timer
            this.debounceTimers[key] = setTimeout(() => {

              this.pending[key] = true;
              this.error[key] = false;
              this.cdr.detectChanges();
              this.appService.updateField(this.data().id, key, control.value).subscribe({
                next: () => {
                  this.pending[key] = false;
                  control.markAsPristine(); // resets dirty state
                  this.cdr.detectChanges();
                },
                error: () => {
                  this.pending[key] = false;
                  this.error[key] = true;
                  this.cdr.detectChanges();
                }
              });
            }, settings.autosaveDelay);  //set delay time in ms
          }
      }
    });

  }

  ngOnChanges() {
    if (this.applicationId !== 0) {
      this.loadApplication(this.applicationId);
    }
  }

  loadApplication(id: number) {
    if (id > 0) {
      this.appService.getApplication(id).subscribe({
        next: (app) => {
          if (app != null) {
            this.data.set(app);
            this.form.patchValue(app);
            //this.cdr.detectChanges();
            console.log("Saw: " + app.id);
            console.log("APPID:" + this.data().id);
          }
        },
        error: () => {
        }
      });
    }
  }

  public onCreate() {
    this.data.set(NewApplicationData());
    this.form.patchValue(this.data);
    this.appService.createApplication().subscribe({
      next: (result) => {
        console.log("OnCreate() got back an id of " + result.applicationId);
        this.data.update(app => ({ ...app, id: result.applicationId }));
        this.cdr.detectChanges();
      }
    })
  }

  save() {
    const app: ApplicationData = this.form.value;
    this.appService.saveApplication(app).subscribe({
      next: () => {
      }
    })
  }

}
