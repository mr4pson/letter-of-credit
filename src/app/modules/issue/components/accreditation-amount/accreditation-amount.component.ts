import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
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
import { FormatMoneyPipe } from 'src/app/modules/psb/pipes';
import { ClientAccount } from '../../interfaces/client-account.interface';

@Component({
    selector: 'accreditation-amount',
    templateUrl: 'accreditation-amount.component.html',
    styleUrls: ['accreditation-amount.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccreditationAmountComponent extends OnDestroyMixin {
    commission = 0;
    ButtonType = ButtonType;
    form = this.formService.createForm();
    AccreditationAmountFormField = AccreditationAmountFormField;
    commission$: Observable<number>;
    comissionLoading = false;
    accounts$ = this.store.isIssueVissible$.pipe(
        filter(isIssueVisible => isIssueVisible),
        switchMap(() => {
            this.form.controls[AccreditationAmountFormField.IssueSum].patchValue(this.store.payment?.summa.toString());
            return this.clientAccountService.getClientAccounts();
        }),
        catchError(() => {
            this.errorHandlerService.showErrorMessage(GET_ACCOUNTS_ERROR_MESSAGE);

            return of([]);
        }),
    )

    constructor(
        private store: StoreService,
        private accountService: AccountService,
        private clientAccountService: ClientAccountService,
        private errorHandlerService: ErrorHandlerService,
        private stepService: StepService,
        private router: Router,
        private formService: AccreditationAmountFormService,
        private formatMoney: FormatMoneyPipe,
    ) {
        super();
        this.commission$ = this.form.get(AccreditationAmountFormField.IssueSum).valueChanges.pipe(
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
        );
    }

    handleAccountSelect(account: ClientAccount): void {
        this.store.letterOfCredit.payerAccount = account.accountCode;
    }

    handleSubmit(): void {
        if (isFormValid(this.form)) {
            this.store.letterOfCredit.paymentSum = this.formService.issueSum;

            this.stepService.setStepDescription(
                paths[Page.ACCREDITATION_AMOUNT],
                `${this.formatMoney.transform((Number(this.formService.issueSum) + this.commission))}`,
            );
            this.router.navigateByUrl(paths[Page.COUNTERPARTY]);
        }
    }
}
