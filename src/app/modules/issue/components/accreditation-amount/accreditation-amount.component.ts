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

@Component({
    selector: 'accreditation-amount',
    templateUrl: 'accreditation-amount.component.html',
    styleUrls: ['accreditation-amount.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccreditationAmountComponent extends OnDestroyMixin implements OnInit {
    commission = 0;
    ButtonType = ButtonType;
    form = this.formService.createForm();
    AccreditationAmountFormField = AccreditationAmountFormField;
    commission$: Observable<number>;
    accounts$ = this.store.isIssueVissible$.pipe(
        filter(value => value),
        switchMap(() => this.clientAccountService.getClientAccounts()),
        tap((accounts) => {
            if (accounts.length > 0) {
                this.form.controls[AccreditationAmountFormField.SelectedAccount].setValue(
                    accounts[0],
                );
            }
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
    ) {
        super();
        this.commission$ = this.form.get(AccreditationAmountFormField.IssueSum).valueChanges.pipe(
            switchMap(issueSum => (
                this.accountService.getCommision(Number(issueSum))
            )),
            map((commission) => {
                this.commission = Number(commission);

                return this.commission;
            }),
            catchError(() => {
                this.errorHandlerService.showErrorMessage(GET_COMMISSION_ERROR_MESSAGE);
                this.commission = 0;

                return of(this.commission);
            }),
        );
    }

    ngOnInit(): void {
        this.store.isIssueVissible$.pipe(
            filter(isIssueVissible => isIssueVissible),
            tap(() => {
                this.form.controls[AccreditationAmountFormField.IssueSum].patchValue(this.store.payment?.summa);
            }),
            untilComponentDestroyed(this)
        ).subscribe();
    }

    handleSubmit(): void {
        if (isFormValid(this.form)) {
            this.store.letterOfCredit.paymentSum = this.formService.issueSum;

            this.stepService.setStepDescription(
                paths[Page.ACCREDITATION_AMOUNT],
                (Number(this.formService.issueSum) + this.commission).toString(),
            );
            this.router.navigateByUrl(paths[Page.COUNTERPARTY]);
        }
    }
}
