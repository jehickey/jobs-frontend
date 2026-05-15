import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsForm } from './apps-form';

describe('AppsForm', () => {
  let component: AppsForm;
  let fixture: ComponentFixture<AppsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AppsForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
