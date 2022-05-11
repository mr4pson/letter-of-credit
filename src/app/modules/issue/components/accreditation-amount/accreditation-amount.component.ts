import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnDestroyMixin } from '@w11k/ngx-componentdestroyed';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { Page, paths } from '../../constants/routes';
import { ClientAccountService } from '../../services/client-accounts.service';
import { StepService } from '../../services/step.service';

import { getMinMaxFormControlValidator } from '@psb/validations/minMax';
import { getRequiredFormControlValidator } from '@psb/validations/required/validation';
import { ButtonType } from '@psb/fe-ui-kit';
import { AccountService, ErrorHandlerService, StoreService } from 'src/app/services';
import { isFormValid } from 'src/app/utils';

@Component({
  selector: 'accreditation-amount',
  templateUrl: 'accreditation-amount.component.html',
  styleUrls: ['accreditation-amount.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccreditationAmountComponent extends OnDestroyMixin implements OnInit {
  public commission = 0;
  public ButtonType = ButtonType;
  public form = new FormGroup({
    IssueSum: new FormControl(null, {
      validators: [
        Validators.required,
        getRequiredFormControlValidator('Укажите сумму аккредитива'),
        getMinMaxFormControlValidator({
          min: 1,
          max: 1_000_000_000_000,
          errorMessage: 'Укажите сумму аккредитива',
        }),
      ],
      updateOn: 'blur',
    }),
    SelectedAccount: new FormControl(null,  [
      Validators.required,
      getRequiredFormControlValidator('Выберите счет из списка'),
    ]),
  });

  public comission$ = this.form.get('IssueSum').valueChanges.pipe(
    switchMap(issueSum => (
      this.accountService.getCommision(Number(issueSum))
    )),
    map((commission) => {
      this.commission = Number(commission);

      return this.commission;
    }),
    catchError(() => {
      this.errorHandlerService.showErrorMesssage('Ошибка при получении размера коммисии.');
      this.commission = 0;

      return of(this.commission);
    }),
  );

  public accounts$ = this.clientAccountService.getClientAccounts().pipe(
    tap((accounts) => {
      if (accounts.length > 0) {
        this.form.controls.SelectedAccount.setValue(
          accounts[0],
        );
      }
    }),
    catchError(() => {
      this.errorHandlerService.showErrorMesssage('Ошибка при получении списка счетов.');

      return of([]);
    }),
  );

  constructor(
    private store: StoreService,
    private accountService: AccountService,
    private clientAccountService: ClientAccountService,
    private errorHandlerService: ErrorHandlerService,
    private stepService: StepService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.store.letterOfCredit.paymentSum > 0) {
      this.form.controls.IssueSum.setValue(this.store.letterOfCredit.paymentSum);
    }
  }

  public get issueSum(): number {
    return Number(this.form.controls.IssueSum.value);
  }

  public handleSubmit(): void {
    if (isFormValid(this.form)) {
      this.store.letterOfCredit.paymentSum = this.issueSum;

      this.stepService.setStepDescription(
        paths[Page.ACCREDITATION_AMOUNT],
        (Number(this.issueSum) + this.commission).toString(),
      );
      this.router.navigateByUrl(paths[Page.COUNTERPARTY]);
    }
  }
}
