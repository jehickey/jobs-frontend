import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationData, NewApplicationData } from '../../models/ApplicationData';
import { ApplicationService } from '../../services/application-service';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings-service';
import { FocusNext } from '@angular/cdk/menu';
import { Field } from "../../field/field";
import { EventEmitter } from '@angular/core';


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
  allowEdits = signal<boolean>(true);
  showDeletePopup = signal<boolean>(false);

  changed: Record<string, boolean> = {};
  pending: Record<string, boolean> = {};
  error: Record<string, boolean> = {};
  private debounceTimers: Record<string, any> = {};

  @Input() applicationId = 0;

  @Output() RefreshList = new EventEmitter<boolean>();

  statusColor = '';

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

    this.form.get('position')!.valueChanges.subscribe(value => {
      this.RefreshList.emit(true)
      this.cdr.detectChanges();
    });
    this.loadApplication(0);
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
            this.form.reset(app);
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
    //this.data.set(NewApplicationData());
    //this.form.patchValue(this.data());
    this.appService.createApplication().subscribe({
      next: (result) => {
        console.log("OnCreate() got back an id of " + result.applicationId);
        this.loadApplication(result.applicationId);
        //this.data.update(app => ({ ...app, id: result.applicationId }));
        this.cdr.detectChanges();
        this.RefreshList.emit(true)
      }
    })
  }

  public onDelete() {
    //popup verification window
    this.showDeletePopup.set(true);
    if (!this.data() || this.data().id == 0) return;
    console.log("delete?");
  }

  public onCancelDelete() {
    this.showDeletePopup.set(false);
    console.log("Cancel delete");
  }

  public onConfirmDelete() {
    console.log("Do the delete");
    this.showDeletePopup.set(false);
    if (!this.data() || this.data().id == 0) return;

    this.appService.deleteApplication(this.data().id).subscribe(result => {
      console.log("Done: " + result);
      this.data.set(NewApplicationData());
      this.RefreshList.emit(true)
    });

    console.log("Delete call made...");
  }

  save() {
    const app: ApplicationData = this.form.value;
    this.appService.saveApplication(app).subscribe({
      next: () => {
      }
    })
  }

  onStatusColor(color: string) {
    this.statusColor = color;
  }

  public onToggleEdit() {
    this.allowEdits.set(!this.allowEdits());
  }

}
