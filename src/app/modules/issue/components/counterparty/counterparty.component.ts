import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { PartnersService } from '../../services/partners.service';
import { Client } from '../../interfaces/client.interface';
import { Partner } from '../../interfaces/partner.interface';
import { Page, paths } from '../../constants/routes';
import { StepService } from '../../services/step.service';
import { CounterpartyFormService } from './counterparty-form.service';
import { CounterpartyFormField } from '../../enums/counterparty-form-field.enum';

import { AccountService } from 'src/app/services/account.service';
import { BankSearch } from 'src/app/interfaces/api/bank-search.interface';
import { ButtonType } from '@psb/fe-ui-kit';
import { StoreService } from 'src/app/services/store.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { isFormValid } from 'src/app/utils';
import {
    BANK_NOT_DEFINED_CONTROL_MESSAGE,
    GET_BANK_INFO_ERROR_MESSAGE,
    GET_CLIENT_LIST_ERROR_MESSAGE,
    GET_PARTER_LIST_ERROR_MESSAGE
} from './constants';
import { takeUntilDestroyed, UntilDestroy } from '@psb/angular-tools';

@Component({
    selector: 'counterparty',
    templateUrl: 'counterparty.component.html',
    styleUrls: ['counterparty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class СounterpartyComponent implements OnInit {
    clientCompanyName = this.store.letterOfCredit.receiverName;
    receiverBankName = this.store.letterOfCredit.receiverBankName;
    ButtonType = ButtonType;
    form = this.formService.createForm();
    CounterpartyFormField = CounterpartyFormField;
    clients$: Observable<Client[]>;

    private partners$: Observable<Partner[]>;

    constructor(
        private store: StoreService,
        private accountService: AccountService,
        private partnersService: PartnersService,
        private errorHandlerService: ErrorHandlerService,
        private stepService: StepService,
        private router: Router,
        private formService: CounterpartyFormService,
    ) {
        this.initObservables();
    }

    ngOnInit(): void {
        this.form.patchValue({
            inn: this.store.letterOfCredit.receiverInn,
            bik: this.store.letterOfCredit.receiverBankBik,
            account: this.store.letterOfCredit.receiverAccount,
        });

        this.subscribeOnFormFieldsChanges();
    }

    private initObservables(): void {
        this.partners$ = this.partnersService.getPartners().pipe(
            catchError(() => {
                this.errorHandlerService.showErrorMessage(GET_PARTER_LIST_ERROR_MESSAGE);

                return of<Partner[]>([]);
            }),
        );
        this.clients$ = this.formService.innControl.valueChanges.pipe(
            filter((inn: string) => inn?.length === 10 || inn?.length === 12),
            switchMap((inn: string) => (
                this.accountService.searchClientByInn(inn).pipe(
                    catchError(() => {
                        this.errorHandlerService.showErrorMessage(GET_CLIENT_LIST_ERROR_MESSAGE);

                        return EMPTY;
                    }),
                )
            )),
            map(clients => (
                clients.map(client => {
                    const length = this.formService.innControl.value.length;

                    return {
                        ...client,
                        innFound: client.inn.substring(0, length),
                        innTail: client.inn.substring(length),
                    };
                })
            )),
        );
    }

    private subscribeOnFormFieldsChanges(): void {
        merge(
            this.formService.bikControl.valueChanges.pipe(
                switchMap(() => {
                    if (this.formService.bikControl.value?.length === 9) {
                        this.formService.bikControl.setErrors(null);

                        return this.accountService.searchBankByBik(this.formService.bikControl.value);
                    }

                    this.store.letterOfCredit.receiverBankName = '';
                    this.receiverBankName = '';
                    return of<BankSearch>(null);
                }),
                tap((bank) => {
                    if (!bank) {
                        this.formService.bikControl.setErrors({ incorrect: BANK_NOT_DEFINED_CONTROL_MESSAGE });
                        this.formService.bikControl.markAsTouched();
                        this.store.letterOfCredit.receiverBankName = '';
                        this.receiverBankName = '';

                        return;
                    }

                    this.store.letterOfCredit.receiverBankName = bank.fullName;
                    this.receiverBankName = bank.fullName;
                    this.store.letterOfCredit.receiverBankBik = this.formService.bikControl.value;
                }),
                catchError(() => {
                    this.errorHandlerService.showErrorMessage(GET_BANK_INFO_ERROR_MESSAGE);

                    return EMPTY;
                }),
            ),
            this.formService.accountControl.valueChanges.pipe(
                tap(() => {
                    this.store.letterOfCredit.receiverAccount = this.formService.accountControl.valid ?
                        this.formService.accountControl.value : '';
                }),
            ),
        ).pipe(
            takeUntilDestroyed(this),
        ).subscribe();
    }

    selectClient(client: Client): void {
        this.clientCompanyName = '';

        if (client) {
            this.formService.innControl.setValue(client.inn);
            this.clientCompanyName = client.shortName;
            this.store.letterOfCredit.receiverInn = client.inn;
            this.store.letterOfCredit.receiverName = client.shortName;

            this.partners$.pipe(
                filter(partners => !!partners?.length),
                tap((partners) => {
                    const curPartner: Partner = partners.find(partner => partner.inn === this.store.letterOfCredit.receiverInn);
                    if (curPartner?.banks && curPartner?.banks.length > 0) {
                        this.formService.bikControl.setValue(curPartner.banks[0].bik);
                        this.formService.accountControl.setValue(curPartner.banks[0].acc);
                    }
                }),
                takeUntilDestroyed(this),
            ).subscribe();
        }
    }

    handleSubmit(): void {
        if (isFormValid(this.form)) {
            this.stepService.setStepDescription(
                paths[Page.COUNTERPARTY],
                this.store.letterOfCredit.receiverBankName,
            );
            this.router.navigateByUrl(paths[Page.COUNTERPARTY_CONTRACT]);
        }
    }
}
