import { Injectable } from '@angular/core';

import { AccountService } from './account.service';
import { ClientAccount } from './client-account.model';

@Injectable()
export class ClientAccountsService {
  constructor(private accountServiceInstance: AccountService) { }

  public async fetchAccountsAsync(): Promise<ClientAccount[]> {
    const accounts = await this.accountServiceInstance.getAccountList().toPromise();

    if (!accounts?.length || this.accountServiceInstance.lastError) {
      alert('Ошибка при получении списка счетов.');
      return;
    }

    const newAccounts: ClientAccount[] = [];

    accounts.forEach((account) => {
      const newAccount = new ClientAccount();
      newAccount.balance = account.balance;
      newAccount.accountCode = account.code;
      accounts.push(account);
    });

    return newAccounts;
  }
}
