import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IssueSuccessComponent } from '../issue-success/issue-success.component';
import { LetterOfCredit } from '../../interfaces/letter-of-credit.interface';

import { ButtonType, SuccessModalComponent, SuccessModalType } from '@psb/fe-ui-kit';
import { getRequiredFormControlValidator } from '@psb/validations/required/validation';
import { PsbDomHelper } from 'src/app/classes/psb-dom.helper';
import { StoreService } from 'src/app/models/state.service';

@Component({
  selector: 'send-application',
  templateUrl: 'send-application.component.html',
  styleUrls: ['send-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendApplicationComponent extends OnDestroyMixin implements OnInit {
  @Input() locInstance: LetterOfCredit;

  public form = new FormGroup({
    agreeWithTerms: new FormControl(true),
    createLocTemplate: new FormControl(true),
    contactPerson: new FormControl('', [
      getRequiredFormControlValidator('Вы забыли написать фамилию, имя и отчество.'),
    ]),
    contactPhone: new FormControl('', [
      getRequiredFormControlValidator('Укажите контактный телефон ответственного'),
    ]),
  });

  ButtonType = ButtonType;

  get contactPerson() {
    return this.form.controls.contactPerson;
  }

  get contactPhone() {
    return this.form.controls.contactPhone;
  }

  constructor(
    private store: StoreService,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    merge(
      this.contactPerson.valueChanges.pipe(
        tap((contactPerson) => {
          this.locInstance.contactPerson = this.form.controls.contactPerson.valid
            ? contactPerson
            : '';
        }),
      ),
      this.contactPhone.valueChanges.pipe(
        tap((contactPhone) => {
          this.locInstance.contactPhone = this.form.controls.contactPhone.valid
            ? contactPhone
            : '';
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();

    this.form.patchValue(this.locInstance ?? {});
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public handleSubmit(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });

    if (this.isFormValid()) {
      this.openSuccessDialog();

      console.log(this.form);
    }
  }

  private openSuccessDialog(): void {
    const exampleData = {
      title: 'Заявка отправлена',
      component: IssueSuccessComponent,
    };

    const type = SuccessModalType.Succeed;

    const dialog = this.dialog.open(SuccessModalComponent, {
      data: {
        ...exampleData,
        type,
      },
      panelClass: ['loc-overlay', 'hide-scrollbar'],
    });

    dialog.afterClosed().pipe(
      tap(() => {
        // this.allowIssue = false;
        // TODO navigate out
        PsbDomHelper.showDocuments();
      }),
      untilComponentDestroyed(this),
    ).subscribe();

    this.store.setSuccessDialog(dialog);
  }
}
