import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import '@angular/common/locales/global/ru';
import { Router } from '@angular/router';

import { AccreditationPeriodComponent } from './accreditation-period.component';
import { StepService } from '../../services/step.service';
import { ClosingDocComponent } from './closing-doc/closing-doc.component';
import { Page, paths } from '../../constants/routes';

import { StoreService } from 'src/app/services';
import { PsbModule } from 'src/app/modules/psb/psb.module';

describe('AccreditationPeriodComponent', () => {
  let component: AccreditationPeriodComponent;
  let fixture: ComponentFixture<AccreditationPeriodComponent>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ClosingDocComponent,
        AccreditationPeriodComponent,
      ],
      imports: [
        CommonModule,
        PsbModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        StoreService,
        StepService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditationPeriodComponent);
    component = fixture.componentInstance;
    component.currentDate = new Date('5/13/2022');
    component.closingDocsControl.controls = [];
    component.form.reset();
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add empty closing doc on add button click', () => {
    const addDocBtn = fixture.debugElement.query(By.css('.add-doc-btn'));
    addDocBtn.nativeElement.click();
    fixture.detectChanges();

    const closingDocs = fixture.debugElement.query(By.css('.closing-docs'));

    expect(closingDocs.nativeElement.children.length).toEqual(1);
  });

  it('should remove closing doc on remove button click', () => {
    const addDocBtn = fixture.debugElement.query(By.css('.add-doc-btn'));
    addDocBtn.nativeElement.click();
    fixture.detectChanges();

    const closingDocs = fixture.debugElement.query(By.css('.closing-docs'));
    const removeBtn = closingDocs.children[0].query(By.css('.docs-holder__remove-btn'));
    removeBtn.nativeElement.click();
    fixture.detectChanges();

    expect(closingDocs.nativeElement.children.length).toEqual(0);
  });

  it('should set locDaysNumberControl value on endLocDateControl valueChanges', () => {
    component.endLocDateControl.patchValue(new Date('12/20/2022'));
    fixture.detectChanges();

    expect(component.locDaysNumberControl.value).toEqual('221');
  });

  it('should set endLocDateControl value 0 locDaysNumberControl valueChanges', () => {
    component.locDaysNumberControl.patchValue('221');
    fixture.detectChanges();

    expect(component.endLocDateControl.value).toEqual(new Date('12/20/2022'));
  });

  it('should set initial form', () => {
    const initialFormValue = {
      endLocDate: new Date('06/05/2022'),
      locDaysNumber: '23',
      closingDocs: [
        {
          additionalRequirements: 'test req',
          amount: 1,
          document: 'test doc',
          onlyOriginalDocument: true,
        },
      ],
      isDocumentDigital: true,
      allowUsePartOfLoc: false,
    };

    initialFormValue.closingDocs.forEach((closingDoc) => {
      component.addClosingDoc(closingDoc);
    });
    component.form.patchValue(initialFormValue);
    fixture.detectChanges();

    expect(component.form.value).toEqual(initialFormValue);
  });

  it('should call handleSubmit on button click', () => {
    spyOn(component, 'handleSubmit');
    const submitButton = fixture.debugElement.query(By.css('.accreditation-period__submit button'));
    submitButton.nativeElement.click();

    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('should navigate to counterparty on valid form submit click', () => {
    const initialFormValue = {
      endLocDate: new Date('06/05/2022'),
      locDaysNumber: '23',
      closingDocs: [
        {
          additionalRequirements: 'test req',
          amount: '1',
          document: 'test doc',
          onlyOriginalDocument: true,
        },
      ],
      isDocumentDigital: true,
      allowUsePartOfLoc: false,
    };
    component.form.patchValue(initialFormValue);

    spyOn(router, 'navigateByUrl');
    const submitButton = fixture.debugElement.query(By.css('.accreditation-period__submit button'));
    submitButton.nativeElement.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.SEND_APPLICATION]);
  });
});
