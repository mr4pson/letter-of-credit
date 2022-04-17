import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OnDestroyMixin } from '@w11k/ngx-componentdestroyed';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { ClientAccountService } from '../../services/client-accounts.service';
import { getFormattedBalance } from '../../helpers/client-account.helper';
import { ClientAccount } from '../../interfaces/client-account.interface';
import { Page, paths } from '../../constants/routes';

import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { getMinMaxFormControlValidator } from '@psb/validations/minMax';
import { getRequiredFormControlValidator } from '@psb/validations/required/validation';
import { AccountService } from 'src/app/services/account.service';
import { StoreService } from 'src/app/models/state.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { ButtonType } from '@psb/fe-ui-kit';

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
      this.commission = commission;

      return this.commission;
    }),
    catchError(() => {
      this.errorHandlerService.showErrorMesssage('Ошибка при получении размера коммисии.');
      this.commission = 0;

      return of(this.commission);
    }),
  );

  public accounts$: Observable<SelectedItem[]> = this.clientAccountService.getClientAccounts().pipe(
    map(clientAccounts => (
      clientAccounts.map(clientAccount => ({
        id: clientAccount.accountCode,
        label: clientAccount.title,
        value: clientAccount,
      }))
    )),
    tap((accounts) => {
      if (accounts.length > 0) {
        this.form.controls.SelectedAccount.setValue(
          accounts[0].label,
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
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.store.paymentSum > 0) {
      this.form.controls.IssueSum.setValue(this.store.paymentSum);
    }
  }

  public getAccountSum(accounts: Array<SelectedItem<ClientAccount>>): string {
    const selectedAccount = accounts.find(
      account => account.label === this.form.controls.SelectedAccount.value,
    );

    if (!selectedAccount) {
      return;
    }

    return getFormattedBalance(selectedAccount.value);
  }

  public get issueSum(): number {
    return this.form.controls.IssueSum.value;
  }

  private isFormValid(): boolean {
    return this.form.valid;
  }

  public handleSubmit(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });

    if (this.isFormValid()) {
      this.store.issueStep1Text = (this.issueSum + this.commission).toString();
      this.store.paymentSum = this.issueSum;
      console.log(this.form.value);
      this.router.navigateByUrl(paths[Page.COUNTERPARTY_CONTRACT]);
    }
  }
}
