import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { AccountService } from '../../../services/account.service';
import { ClientAccount } from '../interfaces/client-account.interface';

@Injectable()
export class ClientAccountService {
  constructor(private accountService: AccountService) { }

  public getClientAccounts() {
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
