import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
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

@Component({
    selector: 'counterparty',
    templateUrl: 'counterparty.component.html',
    styleUrls: ['counterparty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class СounterpartyComponent extends OnDestroyMixin implements OnInit {
    clientCompanyName = this.store.letterOfCredit.reciverName;
    reciverBankName = this.store.letterOfCredit.reciverBankName;
    ButtonType = ButtonType;
    form = this.formService.createForm();
    CounterpartyFormField = CounterpartyFormField;

    clients$: Observable<Client[]>;

    private partners$: Observable<Partner[]> = this.partnersService.getPartners().pipe(
        catchError(() => {
            this.errorHandlerService.showErrorMessage(GET_PARTER_LIST_ERROR_MESSAGE);

            return of<Partner[]>([]);
        }),
    );

    constructor(
        private store: StoreService,
        private accountService: AccountService,
        private partnersService: PartnersService,
        private errorHandlerService: ErrorHandlerService,
        private stepService: StepService,
        private router: Router,
        private formService: CounterpartyFormService,
    ) {
        super();
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
                clients.map(client => ({
                    ...client,
                    innFound: client.inn.substring(0, this.formService.innControl.value.length),
                    innTail: client.inn.substring(this.formService.innControl.value.length),
                }))
            )),
        );
    }

    ngOnInit() {
        this.form.patchValue({
            inn: this.store.letterOfCredit.reciverInn,
            bik: this.store.letterOfCredit.reciverBankBik,
            account: this.store.letterOfCredit.reciverAccount,
        });

        merge(
            this.formService.bikControl.valueChanges.pipe(
                switchMap(() => {
                    if (this.formService.bikControl.value?.length === 9) {
                        this.formService.bikControl.setErrors(null);

                        return this.accountService.searchBankByBik(this.formService.bikControl.value);
                    }

                    this.store.letterOfCredit.reciverBankName = '';
                    this.reciverBankName = '';
                    return of<BankSearch>(null);
                }),
                tap((bank) => {
                    if (!bank) {
                        this.formService.bikControl.setErrors({ incorrect: BANK_NOT_DEFINED_CONTROL_MESSAGE });
                        this.formService.bikControl.markAsTouched();
                        this.store.letterOfCredit.reciverBankName = '';
                        this.reciverBankName = '';

                        return;
                    }

                    this.store.letterOfCredit.reciverBankName = bank.fullName;
                    this.reciverBankName = bank.fullName;
                    this.store.letterOfCredit.reciverBankBik = this.formService.bikControl.value;
                }),
                catchError(() => {
                    this.errorHandlerService.showErrorMessage(GET_BANK_INFO_ERROR_MESSAGE);

                    return EMPTY;
                }),
            ),
            this.formService.accountControl.valueChanges.pipe(
                tap(() => {
                    this.store.letterOfCredit.reciverAccount = this.formService.accountControl.valid ?
                        this.formService.accountControl.value : '';
                }),
            ),
        ).pipe(
            untilComponentDestroyed(this),
        ).subscribe();
    }

    selectClient(client: Client) {
        this.clientCompanyName = '';

        if (client) {
            this.formService.innControl.setValue(client.inn);
            this.clientCompanyName = client.shortName;
            this.store.letterOfCredit.reciverInn = client.inn;
            this.store.letterOfCredit.reciverName = client.shortName;

            this.partners$.pipe(
                filter(partners => !!partners?.length),
                tap((partners) => {
                    const curPartner: Partner = partners.find(partner => partner.inn === this.store.letterOfCredit.reciverInn);
                    if (curPartner?.banks && curPartner?.banks.length > 0) {
                        this.formService.bikControl.setValue(curPartner.banks[0].bik);
                        this.formService.accountControl.setValue(curPartner.banks[0].acc);
                    }
                }),
                untilComponentDestroyed(this),
            ).subscribe();
        }
    }

    handleSubmit(): void {
        if (isFormValid(this.form)) {
            this.stepService.setStepDescription(
                paths[Page.COUNTERPARTY],
                this.store.letterOfCredit.reciverName,
            );
            this.router.navigateByUrl(paths[Page.COUNTERPARTY_CONTRACT]);
        }
    }
}
