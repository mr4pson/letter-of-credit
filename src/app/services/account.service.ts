import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiAccountList } from '../classes/interfaces/api-account-list.interface';
import { ApiAccount } from '../classes/interfaces/api-account.interface';
import { BankSearch } from '../classes/interfaces/bank-search.interface';
import { Client } from '../modules/issue/interfaces/client.interface';
import { ReciverStatus } from '../classes/reciver-status';
import { StorageService } from './storage.service';
import { ReliabilityResult } from '../models/reliability.interface';
import { StoreService } from '../models/state.service';

import { LetterService } from 'src/api/services';

@Injectable()
export class AccountService {
  public lastError: object = null;

  constructor(
    public store: StoreService,
    public storage: StorageService,
    private http: HttpClient,
    private letterService: LetterService,
  ) {}

  public getAllowLoC(reciverINN: string): Observable<boolean> {
    this.lastError = null;

    return this.letterService
      .apiLcIsLcOffersEnabledClientIdGet({
        clientId: this.storage.getClientID(),
        branchId: this.storage.getBranchID(),
        contractor: reciverINN,
      })
      .pipe(
        map((result: any) => {
          return !!result?.canShowOffer;
        }),
      );
  }

  public getIsBadReliability(reciverINN: string): Observable<boolean> {
    this.lastError = null;

    // This request isn't from swagger
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
    if (this.store.reciverInn === reciverINN) {
      if (reliability.red) {
        this.store.reciverStatus = ReciverStatus.Unreliable;
      } else if (reliability.yellow) {
        this.store.reciverStatus = ReciverStatus.PartlyReliable;
      } else {
        this.store.reciverStatus = ReciverStatus.Reliable;
      }
    }
  }

  public setDisableLoCOffers(reciverINN: string): Observable<boolean> {
    return this.letterService
      .apiLcEnableLcOffersClientIdPost$Json({
        clientId: this.storage.getClientID(),
        branchId: this.storage.getBranchID(),
        contractor: reciverINN,
      })
      .pipe(
        map((response) => {
          if (!response && response.success) {
            return true;
          }
        }),
      );
  }

  public getAccountList(): Observable<ApiAccount[]> {
    const url =
      `${this.storage.apiDomain}api/Account/clients/${this.storage.getClientID()}?branchId=${this.storage.getBranchID()}&account=${this.storage.getAccountID()}&v=${
        this.storage.apiVersion
      }`;

    return this.http.get<ApiAccountList>(url).pipe(
      map((response) => {
        // if (response?.accounts?.length === 0) {
        if (!response || !response.accounts || 0 === response.accounts.length) {
          return null;
        }

        return response.accounts;
      }),
    );
  }

  public getCommision(total: number): Observable<number> {
    const url =
      `${this.storage.apiDomain}api/LC/calculateCommission?total=${total}`;

    return this.http.get<{ commissionValue: number }>(url).pipe(
      map(response => response?.commissionValue),
    );
  }

  public searchClientByInn(inn: string): Observable<Client[]> {
    const url = `${this.storage.apiDomain}api/Document/clients/searchByInn/${inn}?v=${this.storage.apiVersion}`;

    return this.http.get<Client[]>(url);
  }

  public searchBankByBik(bik: string): Observable<BankSearch> {
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
