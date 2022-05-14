import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { merge } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ClosingDoc } from '../../interfaces/closing-doc.interface';
import { Page, paths } from '../../constants/routes';
import { StepService } from '../../services/step.service';

import { ButtonType } from '@psb/fe-ui-kit';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { StoreService } from 'src/app/services/store.service';
import { getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from 'src/app/utils/utils';
import moment from 'moment';
import { isFormValid } from 'src/app/utils';

@Component({
  selector: 'accreditation-period',
  templateUrl: 'accreditation-period.component.html',
  styleUrls: ['accreditation-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccreditationPeriodComponent extends OnDestroyMixin implements OnInit {
  public form = new FormGroup({
    endLocDate: new FormControl(getTomorrowDate(), [
      getRequiredFormControlValidator(
        'Укажите дату окончания аккредитива',
      ),
    ]),
    locDaysNumber: new FormControl(''),
    isDocumentDigital: new FormControl(true),
    allowUsePartOfLoc: new FormControl(true),
    closingDocs: new FormArray([]),
  });

  public ButtonType = ButtonType;
  public minEndLocDate = getTomorrowDate();
  public currentDate = new Date();

  get endLocDateControl() {
    return this.form.controls.endLocDate;
  }

  get locDaysNumberControl() {
    return this.form.controls.locDaysNumber;
  }

  get isDocumentDigitalControl() {
    return this.form.controls.isDocumentDigital;
  }

  get allowUsePartOfLocControl() {
    return this.form.controls.allowUsePartOfLoc;
  }

  get closingDocsControl(): FormArray {
    return this.form.controls.closingDocs as FormArray;
  }

  constructor(
    private store: StoreService,
    private router: Router,
    private stepService: StepService,
  ) {
    super();
  }

  ngOnInit(): void {
    const initialEndLocDate = this.store.letterOfCredit.endLocDate;

    this.form.patchValue({
      ...this.store.letterOfCredit,
      endLocDate: initialEndLocDate ? moment(initialEndLocDate) :  moment(getTomorrowDate()),
    });

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

    this.form.patchValue(initialFormValue);

    merge(
      this.endLocDateControl.valueChanges.pipe(
        filter(endLocDate => endLocDate && endLocDate.getTime() > 0),
        tap((endLocDate: Date) => {
          const newLocDaysNumber = getSubstractDatesDays(endLocDate, this.currentDate);

          if (newLocDaysNumber > 0 && newLocDaysNumber !== this.locDaysNumberControl.value) {
            this.store.letterOfCredit.endLocDate = this.endLocDateControl.valid
              ? endLocDate
            : getTomorrowDate();

            this.setLocDays();
          }
        }),
      ),
      this.locDaysNumberControl.valueChanges.pipe(
        tap((locDaysNumber) => {
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
        }),
      ),
      this.isDocumentDigitalControl.valueChanges.pipe(
        tap(() => this.store.letterOfCredit.isDocumentDigital = this.isDocumentDigitalControl.value),
      ),
      this.allowUsePartOfLocControl.valueChanges.pipe(
        tap(() => this.store.letterOfCredit.allowUsePartOfLoc = this.allowUsePartOfLocControl.value),
      ),
      this.closingDocsControl.valueChanges.pipe(
        tap((closingDocs: ClosingDoc[]) => {
          this.store.letterOfCredit.closingDocs = [];
          closingDocs.forEach((closingDoc: ClosingDoc) => {
            if (!closingDoc.document?.trim()) {

              return;
            }
            this.store.letterOfCredit.closingDocs.push({ ...closingDoc });
          });
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();

    if (this.store.letterOfCredit.closingDocs) {
      this.store.letterOfCredit.closingDocs.forEach(closingDoc => this.addClosingDoc(closingDoc));

      return;
    }

    this.addClosingDoc();
  }

  public addClosingDoc({
    document,
    amount,
    onlyOriginalDocument,
    additionalRequirements,
  } = {} as ClosingDoc): void {
    const docFormGroup = {
      document: new FormControl(document),
      amount: new FormControl(amount ?? 1),
      onlyOriginalDocument: new FormControl(
        onlyOriginalDocument !== undefined ? onlyOriginalDocument : true,
      ),
      additionalRequirements: new FormControl(
        additionalRequirements,
      ),
    };

    this.closingDocsControl.push(
      new FormGroup(docFormGroup),
    );
  }

  public handleDelete(index: number): void {
    this.closingDocsControl.controls.splice(index, 1);
  }

  public handleSubmit(): void {
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
