import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { Page, paths } from '../../constants/routes';
import { ClientAccountService } from '../../services/client-accounts.service';
import { StepService } from '../../services/step.service';
import { AccreditationAmountFormField } from '../../enums/accreditation-amount-form-field.enum';

import { ButtonType } from '@psb/fe-ui-kit';
import { AccountService, ErrorHandlerService, StoreService } from 'src/app/services';
import { isFormValid } from 'src/app/utils';
import { GET_ACCOUNTS_ERROR_MESSAGE, GET_COMMISSION_ERROR_MESSAGE } from './constants';
import { AccreditationAmountFormService } from './accreditation-amount-form.service';
import { ClientAccount } from '../../interfaces/client-account.interface';
import { MoneyAmountPipe, takeUntilDestroyed, UntilDestroy } from '@psb/angular-tools';

@Component({
    selector: 'accreditation-amount',
    templateUrl: 'accreditation-amount.component.html',
    styleUrls: ['accreditation-amount.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class AccreditationAmountComponent {
    commission = 0;
    ButtonType = ButtonType;
    form = this.formService.createForm();
    AccreditationAmountFormField = AccreditationAmountFormField;
    comissionLoading = false;
    accounts$: Observable<ClientAccount[]>;

    constructor(
        private store: StoreService,
        private accountService: AccountService,
        private clientAccountService: ClientAccountService,
        private errorHandlerService: ErrorHandlerService,
        private stepService: StepService,
        private router: Router,
        private formService: AccreditationAmountFormService,
        private formatMoney: MoneyAmountPipe,
    ) {
        this.initObservables();
        this.subscribeOnFormFieldsChanges();
    }

    private initObservables(): void {
        this.accounts$ = this.store.isIssueVissible$.pipe(
            filter(isIssueVisible => isIssueVisible),
            switchMap(() => {
                this.form.get(AccreditationAmountFormField.IssueSum).patchValue(this.store.payment?.summa.toString());
                return this.clientAccountService.getClientAccounts();
            }),
            tap(accounts => {
                if (accounts.length) {
                    this.form.get(AccreditationAmountFormField.SelectedAccount).patchValue(accounts[0]);
                }
            }),
            catchError(() => {
                this.errorHandlerService.showErrorMessage(GET_ACCOUNTS_ERROR_MESSAGE);

                return of([]);
            }),
        );
    }

    private subscribeOnFormFieldsChanges(): void {
        this.form.get(AccreditationAmountFormField.IssueSum).valueChanges.pipe(
            switchMap(issueSum => {
                const summa = issueSum ? Number(issueSum) : 0;
                this.comissionLoading = true;
                return this.accountService.getCommision(Number(summa))
            }),
            map((commission) => {
                this.commission = Number(commission);
                this.comissionLoading = false;

                return this.commission;
            }),
            catchError(() => {
                this.comissionLoading = false;
                this.errorHandlerService.showErrorMessage(GET_COMMISSION_ERROR_MESSAGE);
                this.commission = 0;

                return of(this.commission);
            }),
            takeUntilDestroyed(this)
        ).subscribe();
    }

    handleAccountSelect(account: ClientAccount): void {
        this.store.letterOfCredit.payerAccount = account.accountCode;
    }

    handleSubmit(): void {
        if (isFormValid(this.form)) {
            this.store.letterOfCredit.paymentSum = this.formService.issueSum;

            this.stepService.setStepDescription(
                paths[Page.ACCREDITATION_AMOUNT],
                `${this.formatMoney.transform((Number(this.formService.issueSum) + this.commission), '₽')}`,
            );
            this.router.navigateByUrl(paths[Page.COUNTERPARTY]);
        }
    }
}
