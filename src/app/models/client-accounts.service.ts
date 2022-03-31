import {Injectable} from "@angular/core";
import {AccountService} from "./account.service";
import {ClientAccount} from "./client-account.model";

@Injectable()
export class ClientAccountsService {
	constructor(private accountServiceInstance: AccountService) { }

	public async FetchAccountsAsync(): Promise<ClientAccount[]> {
		const accounts = await this.accountServiceInstance.GetAccountList().toPromise();

		if (!accounts?.length || this.accountServiceInstance.lastError) {
			alert("Ошибка при получении списка счетов.");
			return;
		}

		const newAccounts: ClientAccount[] = [];

		accounts.forEach(account => {
			const newAccount = new ClientAccount();
			newAccount.Balance = account.balance;
			newAccount.AccountCode = account.code;
			accounts.push(account);
		});
		

		return newAccounts;
	}
}
