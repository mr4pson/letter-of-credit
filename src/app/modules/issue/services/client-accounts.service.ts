import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ClientAccount } from '../interfaces/client-account.interface';

import { AccountService } from 'src/app/services';

@Injectable()
export class ClientAccountService {
  constructor(private accountService: AccountService) { }

  getClientAccounts() {
    return  this.accountService.getAccountList().pipe(
      map(accounts => (
          accounts.map<ClientAccount>(account => ({
            title: 'Расчетный',
            balance: account.balance,
            accountCode: account.code,
          }))
        ),
      ),
    );
  }
}
