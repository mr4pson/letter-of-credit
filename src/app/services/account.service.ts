import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountResponse } from '../interfaces/api/account-response.interface';
import { Account } from '../interfaces/api/account.interface';
import { BankSearch } from '../interfaces/api/bank-search.interface';
import { Client } from '../modules/issue/interfaces/client.interface';
import { ReciverStatus } from '../enums/reciver-status.enum';
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

    getAllowLoC(reciverINN: string): Observable<boolean> {
        return this.letterService.apiLcIsLcOffersEnabledClientIdGet$Response({
            clientId: this.storage.getClientID(),
            branchId: this.storage.getBranchID(),
            contractor: reciverINN,
        }).pipe(
            map((response: any) => JSON.parse(response.body)),
            map((response: { canShowOffer }) => {
                return response.canShowOffer;
            }),
        );
    }

    getIsBadReliability(reciverINN: string): Observable<boolean> {
        const url =
            `${this.storage.apiDomain}api/Document/reliability/${reciverINN}?v=${this.storage.apiVersion}`;

        return this.http.get(url).pipe(
            map((reliability: ReliabilityResult) => {
                this.setReciverStatus(reciverINN, reliability);

                return (
                    reliability.yellow ||
                    reliability.red ||
                    (!reliability.red && !reliability.yellow && !reliability.green)
                );
            }),
        );
    }

    private setReciverStatus(
        reciverINN: string,
        reliability: ReliabilityResult,
    ): void {
        if (this.store.letterOfCredit.reciverInn === reciverINN) {
            if (reliability.red) {
                this.store.reciverStatus = ReciverStatus.Unreliable;
            } else if (reliability.yellow) {
                this.store.reciverStatus = ReciverStatus.PartlyReliable;
            } else {
                this.store.reciverStatus = ReciverStatus.Reliable;
            }
        }
    }

    setDisableLoCOffers(reciverINN: string): Observable<boolean> {
        return this.letterService.apiLcEnableLcOffersClientIdPost$Json({
            clientId: this.storage.getClientID(),
            branchId: this.storage.getBranchID(),
            contractor: reciverINN,
        }).pipe(
            map((response) => {
                if (!response && response.success) {
                    return true;
                }
            }),
        );
    }

    getAccountList(): Observable<Account[]> {
        const url =
            `${this.storage.apiDomain}api/Account/clients/${this.storage.getClientID()}?branchId=${this.storage.getBranchID()}&account=${this.storage.getAccountID()}&v=${this.storage.apiVersion
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
        const url = `${this.storage.apiDomain}api/Document/clients/searchByInn/${inn}?v=${this.storage.apiVersion}`;

        return this.http.get<Client[]>(url);
    }

    searchBankByBik(bik: string): Observable<BankSearch> {
        const url =
            `${this.storage.apiDomain}api/Document/getReceiverBanks/${bik}?v=${this.storage.apiVersion}`;

        return this.http.get<BankSearch[]>(url).pipe(
            map((response) => {
                if (response && response.length > 0) {
                    return response[0];
                }
            }),
        );
    }
}
