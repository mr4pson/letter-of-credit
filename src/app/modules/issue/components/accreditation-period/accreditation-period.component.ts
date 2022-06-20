import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
/*
  Вот что я нашел в public-api в библиотеке @psb/angular-tools. Не нашел там замены untilComponentDestroyed
  export { DynamicComponentsService } from '@psb/angular-tools/src/services';
  export { ClickOutsideDirective, ClickOutsideModule } from '@psb/angular-tools/src/click-outside';
  export * from '@psb/angular-tools/src/pipes/money-amount';
  export * from '@psb/angular-tools/src/pipes/endings';
*/
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ClosingDoc } from '../../interfaces/closing-doc.interface';
import { Page, paths } from '../../constants/routes';
import { StepService } from '../../services/step.service';
import { AccreditationPeriodFormField } from '../../enums/accreditation-period-form-field.enum';

import { ButtonType } from '@psb/fe-ui-kit';
import { StoreService } from 'src/app/services/store.service';
import { getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from 'src/app/utils/utils';
import moment from 'moment';
import { isFormValid } from 'src/app/utils';
import { FormService } from './form.service';

@Component({
  selector: 'accreditation-period',
  templateUrl: 'accreditation-period.component.html',
  styleUrls: ['accreditation-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccreditationPeriodComponent extends OnDestroyMixin implements OnInit {
  form = this.formService.createForm();
  ButtonType = ButtonType;
  minEndLocDate = getTomorrowDate();
  currentDate = new Date();
  AccreditationPeriodFormField = AccreditationPeriodFormField;

  private get endLocDateControl() {
    return this.form.controls[AccreditationPeriodFormField.EndLocDate];
  }

  private get locDaysNumberControl() {
    return this.form.controls[AccreditationPeriodFormField.LocDaysNumber];
  }

  private get isDocumentDigitalControl() {
    return this.form.controls[AccreditationPeriodFormField.IsDocumentDigital];
  }

  private get allowUsePartOfLocControl() {
    return this.form.controls[AccreditationPeriodFormField.AllowUsePartOfLoc];
  }

  closingDocsControl: FormArray;

  constructor(
    private store: StoreService,
    private router: Router,
    private stepService: StepService,
    private formService: FormService,
  ) {
    super();
    this.closingDocsControl = this.form.controls[AccreditationPeriodFormField.ClosingDocs] as FormArray;
  }

  ngOnInit(): void {
    const initialEndLocDate = this.store.letterOfCredit.endLocDate;

    this.form.patchValue({
      ...this.store.letterOfCredit,
      endLocDate: initialEndLocDate ? moment(initialEndLocDate) :  moment(getTomorrowDate()),
    });

    this.endLocDateControl.valueChanges.pipe(
      filter(endLocDate => endLocDate && endLocDate.getTime() > 0),
      untilComponentDestroyed(this),
    ).subscribe(this.setStoreEndLocDate.bind(this));

    this.locDaysNumberControl.valueChanges.pipe(
      untilComponentDestroyed(this),
    ).subscribe(this.setLocDateOnDaysNumberChange.bind(this));

    this.isDocumentDigitalControl.valueChanges.pipe(
      untilComponentDestroyed(this),
    ).subscribe(this.setStoreIsDocumentDigital.bind(this));

    this.allowUsePartOfLocControl.valueChanges.pipe(
      untilComponentDestroyed(this),
    ).subscribe(this.setStoreAllowUsePartOfLoc.bind(this));

    this.closingDocsControl.valueChanges.pipe(
      untilComponentDestroyed(this),
    ).subscribe(this.setStoreClosingDocs.bind(this));

    if (this.store.letterOfCredit.closingDocs) {
      this.store.letterOfCredit.closingDocs.forEach(closingDoc => this.addClosingDoc(closingDoc));

      return;
    }
  }

  addClosingDoc(closingDoc = {} as ClosingDoc): void {
    this.formService.addClosingDocControl(closingDoc);
  }

  handleDelete(index: number): void {
    this.closingDocsControl.controls.splice(index, 1);
  }

  handleSubmit(): void {
    if (isFormValid(this.form)) {
      const endLocDate = new Date(this.store.letterOfCredit.endLocDate.toString());
      const stepDescription = `до ${endLocDate.toLocaleDateString(
        'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' },
      )}`;

      this.stepService.setStepDescription(
        paths[Page.ACCREDITATION_PERIOD],
        stepDescription,
      );
      this.router.navigateByUrl(paths[Page.SEND_APPLICATION]);
    }
  }

  private setStoreEndLocDate(endLocDate: Date): void {
    const newLocDaysNumber = getSubstractDatesDays(endLocDate, this.currentDate);

    if (newLocDaysNumber > 0 && newLocDaysNumber !== this.locDaysNumberControl.value) {
      this.store.letterOfCredit.endLocDate = this.endLocDateControl.valid
        ? endLocDate
      : getTomorrowDate();

      this.setLocDays();
    }
  }

  private setLocDateOnDaysNumberChange(locDaysNumber): void {
    const newEndLocDate = getSummedDateDays(this.currentDate, Number(locDaysNumber));

    if (newEndLocDate === this.endLocDateControl.value) {

      return;
    }

    const days: number = Number(locDaysNumber);

    if (days < 1 || days > 365) {
      this.locDaysNumberControl.setValue('');

      return;
    }

    this.setLocDate(days);
  }

  private setStoreIsDocumentDigital(): void {
    this.store.letterOfCredit.isDocumentDigital = this.isDocumentDigitalControl.value;
  }

  private setStoreAllowUsePartOfLoc(): void {
    this.store.letterOfCredit.allowUsePartOfLoc = this.allowUsePartOfLocControl.value
  }

  private setStoreClosingDocs(closingDocs: ClosingDoc[]): void {
    this.store.letterOfCredit.closingDocs = [];
    closingDocs.forEach((closingDoc: ClosingDoc) => {
      if (!closingDoc.document?.trim()) {

        return;
      }
      this.store.letterOfCredit.closingDocs.push({ ...closingDoc });
    });
  }

  private setLocDate(days: number): void {
    const summedDate = getSummedDateDays(this.currentDate, Number(days));

    this.endLocDateControl.setValue(summedDate);
  }

  private setLocDays(): void {
    const locDays = this.endLocDateControl.valid
      ? getSubstractDatesDays(this.endLocDateControl.value, this.currentDate)
      : '';

    if (Number(this.locDaysNumberControl.value) !== locDays && locDays > 0) {
      this.locDaysNumberControl.setValue(
        locDays.toString(),
      );
    }
  }
}
