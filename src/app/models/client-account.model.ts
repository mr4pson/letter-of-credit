import {ApiAccount} from "../classes/interfaces/api-account.interface";

export class ClientAccount {
	public Title = "Расчётный";
	public AccountCode = "";
	private AccountCodeFormatted = "";
	public Balance = 0;
	private BalanceFormatted = "";

	public constructor(data: ApiAccount = null) {
		if (null !== data) {
			this.AccountCode = data.code;
			this.Balance = data.balance;
		}
	}

	public GetFormattedBalance(): string {
		if ("" === this.BalanceFormatted) {
			this.BalanceFormatted = this.Balance.toString().replace(/\d(?=(\d{3})+$)/g, '$& ') + " ₽";
		}

		return this.BalanceFormatted;
	}

	public GetFormattedAccountCode() {
		if ("" === this.AccountCodeFormatted) {
			this.AccountCodeFormatted = this.AccountCode.substr(0, 3) + " " + this.AccountCode.substr(3, 2) + " " +
				this.AccountCode.substr(5, 3) + " " + this.AccountCode.substr(8, 1) + " " +
				this.AccountCode.substr(9, 4) + " " + this.AccountCode.substr(13);
		}

		return this.AccountCodeFormatted;
	}
}
