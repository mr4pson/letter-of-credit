import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountResponse } from '../interfaces/api/account-response.interface';
import { Account } from '../interfaces/api/account.interface';
import { BankSearch } from '../interfaces/api/bank-search.interface';
import { Client } from '../modules/issue/interfaces/client.interface';
import { ReceiverStatus } from '../enums/receiver-status.enum';
import { StorageService } from './storage.service';
import { ReliabilityResult } from '../interfaces/api/reliability-result.interface';
import { StoreService } from './store.service';

import { LetterService } from 'src/api/services';

@Injectable()
export class AccountService {
    constructor(
        private store: StoreService,
        private storage: StorageService,
        private http: HttpClient,
        private letterService: LetterService,
    ) { }

    getAllowLoC(receiverINN: string): Observable<boolean> {
        return this.letterService.apiLcIsLcOffersEnabledClientIdGet$Response({
            clientId: this.storage.getClientID(),
            branchId: this.storage.getBranchID(),
            contractor: receiverINN,
        }).pipe(
            map((response: any) => JSON.parse(response.body)),
            map((response: { canShowOffer }) => {
                return response.canShowOffer;
            }),
        );
    }

    getIsBadReliability(receiverINN: string): Observable<boolean> {
        const url =
            `/api/Document/reliability/${receiverINN}?v=${this.storage.apiVersion}`;

        return this.http.get(url).pipe(
            map((reliability: ReliabilityResult) => {
                this.setReceiverStatus(reliability);

                return (
                    reliability.yellow ||
                    reliability.red ||
                    (!reliability.red && !reliability.yellow && !reliability.green)
                );
            }),
        );
    }

    private setReceiverStatus(
        reliability: ReliabilityResult,
    ): void {
        if (reliability.red) {
            this.store.receiverStatus = ReceiverStatus.Unreliable;
        } else if (reliability.yellow) {
            this.store.receiverStatus = ReceiverStatus.PartlyReliable;
        } else {
            this.store.receiverStatus = ReceiverStatus.Reliable;
        }
    }

    setDisableLoCOffers(receiverINN: string): Observable<boolean> {
        return this.letterService.apiLcEnableLcOffersClientIdPost$Json({
            clientId: this.storage.getClientID(),
            branchId: this.storage.getBranchID(),
            contractor: receiverINN,
        }).pipe(
            map((response) => {
                if (!response && response.success) {
                    return true;
                }
            }),
        );
    }

    getAccountList(): Observable<Account[]> {
        const selectedAccountId = this.storage.getAccountID();
        const defaultAccountId = this.storage.getDefaultAccountID();
        const accountId = selectedAccountId && selectedAccountId != 'null' ? selectedAccountId : defaultAccountId;

        const url =
            `/api/Account/clients/${this.storage.getClientID()}?branchId=${this.storage.getBranchID()}&account=${accountId}&v=${this.storage.apiVersion
            }`;

        return this.http.get<AccountResponse>(url).pipe(
            map((response) => {
                if (!response || !response.accounts || !response.accounts.length) {
                    return [];
                }

                return response.accounts;
            }),
        );
    }

    getCommision(total: number): Observable<number> {
        return this.letterService.apiLcCalculateCommissionGet$Json({ total }).pipe(
            map(response => response?.commissionValue),
        );
    }

    searchClientByInn(inn: string): Observable<Client[]> {
        const url = `/api/Document/clients/searchByInn/${inn}?v=${this.storage.apiVersion}`;

        return this.http.get<Client[]>(url);
    }

    searchBankByBik(bik: string): Observable<BankSearch> {
        const url =
            `/api/Document/getReceiverBanks/${bik}?v=${this.storage.apiVersion}`;

        return this.http.get<BankSearch[]>(url).pipe(
            map((response) => {
                if (response && response.length > 0) {
                    return response[0];
                }
            }),
        );
    }
}
