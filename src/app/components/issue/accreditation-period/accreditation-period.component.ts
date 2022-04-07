import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import { getRequiredFormControlValidator } from '@psb/validations/required';
import { ClosingDoc } from 'src/app/models/closing-doc.model';
import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';

@Component({
  selector: 'accreditation-period',
  templateUrl: 'accreditation-period.component.html',
  styleUrls: ['accreditation-period.component.scss'],
})
export class AccreditationPeriodComponent implements OnInit {
  public issue4Group = new FormGroup({
    EndLocDate: new FormControl('', [
      getRequiredFormControlValidator(
        'Укажите дату окончания аккредитива',
      ),
    ]),
    LocDaysLength: new FormControl(''),
    PerhapsDigitalDoc: new FormControl(true),
    AllowUsePartOfLoc: new FormControl(true),
    ClosingDoc: new FormArray([]),
  });

  public minEndLocDate = new Date();

  @Input() locInstance: LetterOfCredit;

  constructor() {
    this.minEndLocDate.setDate(this.minEndLocDate.getDate() + 1);
  }

  ngOnInit(): void {
    if (!this.locInstance) {
      return;
    }
    this.issue4Group.get('EndLocDate')?.valueChanges.subscribe(() => {
      if ('' === this.issue4Group.controls.EndLocDate.value) {
        return;
      }

      this.locInstance.endLocDate = this.issue4Group.controls.EndLocDate.valid
        ? this.issue4Group.controls.EndLocDate.value
        : '';

      this.setLocDays();
    });

    this.issue4Group.get('LocDaysLength')?.valueChanges.subscribe(() => {
      const daysValue = this.issue4Group.controls.LocDaysLength.value;
      if ('' === daysValue) {
        this.issue4Group.controls.EndLocDate.setValue('');
        return;
      }

      const days: number = Number(daysValue);
      if (days < 1 || days > 365) {
        this.issue4Group.controls.LocDaysLength.setValue('');
        return;
      }

      this.setLocDate(days);
    });

    this.issue4Group.get('PerhapsDigitalDoc')?.valueChanges.subscribe(
      () => {
        this.locInstance.perhapsDigitalDoc =
        this.issue4Group.controls.PerhapsDigitalDoc.value;
      },
    );

    this.issue4Group.get('AllowUsePartOfLoc')?.valueChanges.subscribe(
      () => {
        this.locInstance.allowUsePartOfLoc =
        this.issue4Group.controls.AllowUsePartOfLoc.value;
      },
    );

    this.issue4Group.controls.EndLocDate.setValue(
      this.locInstance.endLocDate,
    );
    this.issue4Group.controls.PerhapsDigitalDoc.setValue(
      this.locInstance.perhapsDigitalDoc,
    );
    this.issue4Group.controls.AllowUsePartOfLoc.setValue(
      this.locInstance.allowUsePartOfLoc,
    );

    if (this.locInstance.closingDocs.length > 0) {
      // tslint:disable-next-line: forin
      for (const index in this.locInstance.closingDocs) {
        this.addClosingDoc(this.locInstance.closingDocs[index]);
      }
    } else {
      this.addClosingDoc();
    }

    this.issue4Group.get('ClosingDoc')?.valueChanges.subscribe(() => {
      this.locInstance.closingDocs = [];
      // tslint:disable-next-line: forin
      for (const index in this.issue4Group.controls.ClosingDoc.value) {
        const item: ClosingDoc =
          this.issue4Group.controls.ClosingDoc.value[index];
        if ('' === item.document.trim()) {
          continue;
        }
        const instance = new ClosingDoc(item);
        this.locInstance.closingDocs.push(instance);
      }
    });
  }

  private setLocDate(days: number): void {
    const nowDate = new Date();
    nowDate.setDate(nowDate.getDate() + days);
    this.issue4Group.controls.EndLocDate.setValue(nowDate);
  }

  private setLocDays(): void {
    const nowDate = new Date();
    const locDays = this.issue4Group.controls.EndLocDate.valid
      ? Math.ceil(
          (this.locInstance.endLocDate.getTime() -
            nowDate.getTime()) /
            1000 /
            3600 /
            24,
        )
      : '';

    if (this.issue4Group.controls.LocDaysLength.value !== locDays) {
      this.issue4Group.controls.LocDaysLength.setValue(
        locDays.toString(),
      );
    }
  }

  public get ClosingDocs(): FormArray {
    return this.issue4Group.get('ClosingDoc') as FormArray;
  }

  public isValid(): boolean {
    this.issue4Group.controls.EndLocDate.setValue(
      this.issue4Group.controls.EndLocDate.value,
    );

    this.issue4Group.controls.EndLocDate.markAsTouched();

    return this.issue4Group.controls.EndLocDate.valid;
  }

  public addClosingDoc(item: ClosingDoc = null) {
    this.ClosingDocs.push(
      new FormGroup({
        Document: new FormControl(null !== item ? item.document : ''),
        Amount: new FormControl(null !== item ? item.amount : 1),
        OnlyOriginalDocument: new FormControl(
          null !== item ? item.onlyOriginalDocument : true,
        ),
        AdditionalRequirements: new FormControl(
          null !== item ? item.additionalRequirements : '',
        ),
      }),
    );
  }
}
