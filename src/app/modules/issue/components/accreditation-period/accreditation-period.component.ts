import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ClosingDoc } from '../../interfaces/closing-doc.interface';
import { LetterOfCredit } from '../../interfaces/letter-of-credit.interface';
import { Page, paths } from '../../constants/routes';

import { ButtonType } from '@psb/fe-ui-kit';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { StoreService } from 'src/app/models/state.service';
import { getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from 'src/app/utils/utils';

@Component({
  selector: 'accreditation-period',
  templateUrl: 'accreditation-period.component.html',
  styleUrls: ['accreditation-period.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccreditationPeriodComponent extends OnDestroyMixin implements OnInit {
  @Input() locInstance: LetterOfCredit;

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
  ) {
    super();
  }

  ngOnInit(): void {
    this.form.patchValue(
      this.locInstance ?? {},
    );

    merge(
      this.endLocDateControl.valueChanges.pipe(
        tap((endLocDate) => {
          if (!endLocDate) {

            return;
          }

          this.locInstance.endLocDate = this.endLocDateControl.valid
            ? endLocDate
            : '';

          this.setLocDays();
        }),
      ),
      this.locDaysNumberControl.valueChanges.pipe(
        tap((locDaysNumber) => {
          if (!locDaysNumber) {
            this.endLocDateControl.setValue('');

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
        tap(() => this.locInstance.isDocumentDigital = this.isDocumentDigitalControl.value),
      ),
      this.allowUsePartOfLocControl.valueChanges.pipe(
        tap(() => this.locInstance.allowUsePartOfLoc = this.allowUsePartOfLocControl.value),
      ),
      this.closingDocsControl.valueChanges.pipe(
        tap((closingDocs: ClosingDoc[]) => {
          this.locInstance.closingDocs = [];
          closingDocs.forEach((closingDoc: ClosingDoc) => {
            if (!closingDoc.document?.trim()) {

              return;
            }
            this.locInstance.closingDocs.push({ ...closingDoc });
          });
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();

    if (this.locInstance.closingDocs) {
      this.locInstance.closingDocs.forEach(closingDoc => this.addClosingDoc(closingDoc));
    } else {
      this.addClosingDoc();
    }
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public addClosingDoc({
    document,
    amount,
    onlyOriginalDocument,
    additionalRequirements,
  } = {} as ClosingDoc): void {
    const closingDocument = {
      Document: new FormControl(document),
      Amount: new FormControl(amount ?? 1),
      OnlyOriginalDocument: new FormControl(
        onlyOriginalDocument !== undefined ? onlyOriginalDocument : true,
      ),
      AdditionalRequirements: new FormControl(
        additionalRequirements,
      ),
    };

    this.closingDocsControl.push(
      new FormGroup(closingDocument),
    );
  }

  public handleSubmit(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });

    if (this.isFormValid()) {
      this.store.issueStep4Text = `до ${this.locInstance?.endLocDate.toLocaleDateString(
        'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' },
      )}`;
      console.log(this.form.value);
      this.router.navigateByUrl(paths[Page.SEND_APPLICATION]);
    }
  }

  private setLocDate(days: number): void {
    const summedDate = getSummedDateDays(this.currentDate, days);

    this.endLocDateControl.setValue(summedDate);
  }

  private setLocDays(): void {
    const locDays = this.endLocDateControl.valid
      ? getSubstractDatesDays(this.endLocDateControl.value, this.currentDate)
      : '';

    if (this.locDaysNumberControl.value !== locDays && locDays !== 0) {
      this.locDaysNumberControl.setValue(
        locDays.toString(),
      );
    }
  }
}
