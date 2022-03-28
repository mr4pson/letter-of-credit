import {Injectable} from "@angular/core";
import {AccountService} from "./account.service";
import {ClientAccount} from "./client-account.model";

@Injectable()
export class ClientAccountsService {
	constructor(private AccountServiceInstance: AccountService) { }

	public async FetchAccountsAsync(): Promise<ClientAccount[]> {
		let accounts: ClientAccount[] = [];
		let result = await this.AccountServiceInstance.GetAccountListAsync();
		if (0 == result?.length || null !== this.AccountServiceInstance.LastError) {
			alert("Ошибка при получении списка счетов.");
			return;
		}

		for (let i = 0; i < result.length; i++) {
			let account = new ClientAccount();
			account.Balance = result[i].balance;
			account.AccountCode = result[i].code;
			accounts.push(account);
		}

		return accounts;
	}
}
