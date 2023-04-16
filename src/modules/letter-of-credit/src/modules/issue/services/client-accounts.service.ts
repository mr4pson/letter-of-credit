import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ClientAccount } from '../interfaces/client-account.interface';

import { AccountService } from '../../../services';
import { Observable } from 'rxjs';

@Injectable()
export class ClientAccountService {
    constructor(private accountService: AccountService) { }

    getClientAccounts(): Observable<ClientAccount[]> {
        return this.accountService.getAccountList().pipe(
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
