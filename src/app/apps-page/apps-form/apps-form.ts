import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationData } from '../../models/ApplicationData';
import { ApplicationService } from '../../services/application-service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-apps-form',
  imports: [ReactiveFormsModule],
  templateUrl: './apps-form.html',
  styleUrl: './apps-form.scss',
})
export class AppsForm {

  form!: FormGroup;
  constructor(private fb: FormBuilder, private appService: ApplicationService) {

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
  }

  loadApplication(id: number) {
    console.log("Loading");
    const app: ApplicationData = {
      id: 0,
      position: "Middling Tester",
      statusId: 0,
      organization: "XYZ Company",
      dateApplied: 0,
      lastResponse: 0,
      url: "https://xyzco.com/applications/pending",
      siteUser: "mookie",
      sitePass: "",
      sourceId: 0,
      jobPosting: "We're hiring",
      notes: "Assorted Notes",
      created: 0,
      updated: 0,
    }
    this.form.patchValue(app);

    //this.appService.getApplication(id).subscribe(app => {
    //  this.form.patchValue(app);
    //});
  }

  public onCreate() {
    this.loadApplication(0);
  }

  save() {
    const app: ApplicationData = this.form.value;
    this.appService.saveApplication(app).subscribe();
  }







}
