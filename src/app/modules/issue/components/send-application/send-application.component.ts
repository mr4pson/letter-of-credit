import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { IssueSuccessComponent } from '../issue-success/issue-success.component';

import { ButtonType, SuccessModalComponent, SuccessModalType } from '@psb/fe-ui-kit';
import { getRequiredFormControlValidator } from '@psb/validations/required/validation';
import { StoreService } from 'src/app/services/store.service';
import { NgService } from 'src/app/services/ng.service';
import { isFormValid } from 'src/app/utils';

@Component({
  selector: 'send-application',
  templateUrl: 'send-application.component.html',
  styleUrls: ['send-application.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendApplicationComponent extends OnDestroyMixin implements OnInit {
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

  public ButtonType = ButtonType;

  get contactPerson() {
    return this.form.controls.contactPerson;
  }

  get contactPhone() {
    return this.form.controls.contactPhone;
  }

  constructor(
    private store: StoreService,
    private dialog: MatDialog,
    private ngService: NgService,
  ) {
    super();
  }

  ngOnInit(): void {
    merge(
      this.contactPerson.valueChanges.pipe(
        tap((contactPerson) => {
          this.store.letterOfCredit.contactPerson = this.form.controls.contactPerson.valid
            ? contactPerson
            : '';
        }),
      ),
      this.contactPhone.valueChanges.pipe(
        tap((contactPhone) => {
          this.store.letterOfCredit.contactPhone = this.form.controls.contactPhone.valid
            ? contactPhone
            : '';
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();

    this.form.patchValue(this.store.letterOfCredit);
  }

  public handleSubmit(): void {
    if (isFormValid(this.form)) {
      this.openSuccessDialog();
    }
  }

  private openSuccessDialog(): void {
    const dialogData = {
      title: 'Заявка отправлена',
      component: IssueSuccessComponent,
    };

    const type = SuccessModalType.Succeed;

    const dialog = this.dialog.open(SuccessModalComponent, {
      data: {
        ...dialogData,
        type,
      },
      panelClass: ['loc-overlay', 'hide-scrollbar'],
    });

    dialog.afterClosed().pipe(
      tap(() => {
        this.store.isIssueVissible = false;
        this.ngService.showSmbDocuments();
      }),
      untilComponentDestroyed(this),
    ).subscribe();
  }
}
