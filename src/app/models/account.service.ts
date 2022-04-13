import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ServiceBase} from "./service-base";
import {StoreService} from "./state.service";
import {ApiAccountList} from "../classes/interfaces/api-account-list.interface";
import {ApiAccount} from "../classes/interfaces/api-account.interface";
import {ReciverStatus} from "../classes/reciver-status";
import {ClientSearch} from "../classes/interfaces/client-search.interface";
import {BankSearch} from "../classes/interfaces/bank-search.interface";

@Injectable()
export class AccountService extends ServiceBase {
	public LastError: object = null;

	constructor(HttpClientInstance: HttpClient, public Store: StoreService) {
		super(HttpClientInstance);
	}

	public async GetAllowLoCAsync(reciverINN: string): Promise<boolean> {
		this.LastError = null;

		let url = this.ApiDomain + `api/LC/isLCOffersEnabled/${this.ClientID}?branchId=${this.BranchID}&Contractor=${reciverINN}`;

		try {
			let result: {canShowOffer: boolean} = await this.GetAsync(url, this.HttpOptions);

			return !!result?.canShowOffer;
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return false;
	}

	public async GetIsBadReliabilityAsync(reciverINN: string): Promise<boolean> {
		this.LastError = null;

		let url = this.ApiDomain + `api/Document/reliability/${reciverINN}?v=${this.ApiVersion}`;

		try {
			let result: {red: boolean, yellow: boolean, green: boolean} = await this.GetAsync(url, this.HttpOptions);

			if (this.Store.ReciverInn === reciverINN) {
				if (result.red) {
					this.Store.ReciverStatus = ReciverStatus.Unreliable;
				} else if (result.yellow) {
					this.Store.ReciverStatus = ReciverStatus.PartlyReliable;
				} else {
					this.Store.ReciverStatus = ReciverStatus.Reliable;
				}
			}

			return result.yellow || result.red || (!result.red && !result.yellow && !result.green);
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return false;
	}

	public async SetDisableLoCOffersAsync(reciverINN: string): Promise<boolean> {
		this.LastError = null;

		let url = this.ApiDomain + `api/LC/enableLCOffers/${this.ClientID}?branchId=${this.BranchID}&contractor=${reciverINN}`;

		try {
			let result = await this.PostAsync(url, null, this.HttpOptions);

			if (null !== result && result.success) {
				return true;
			}
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return false;
	}

	public async GetAccountListAsync(): Promise<ApiAccount[]> {
		this.LastError = null;

		let url = this.ApiDomain + `api/Account/clients/${this.ClientID}?branchId=${this.BranchID}&account=${this.AccountID}&v=${this.ApiVersion}`;

		try {
			let result: ApiAccountList = await this.GetAsync(url, this.HttpOptions);

			if (!result || !result.accounts || 0 === result.accounts.length) {
				return null;
			}

			return result.accounts;
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return null;
	}

	public async GetCommisionAsync(total: number): Promise<number> {
		this.LastError = null;

		let url = this.ApiDomain + `api/LC/calculateCommission?total=${total}`;

		try {
			let result: {"commissionValue": number} = await this.GetAsync(url, this.HttpOptions);

			if (null !== result && !!result.commissionValue) {
				return result.commissionValue;
			}
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return 0;
	}

	public async SearchClientByInn(inn: string): Promise<ClientSearch[]> {
		this.LastError = null;

		let url = this.ApiDomain + `api/Document/clients/searchByInn/${inn}?v=${this.ApiVersion}`;

		try {
			let result: ClientSearch[] = await this.GetAsync(url, this.HttpOptions);

			if (null !== result && result.length > 0) {
				return result;
			}
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return [];
	}

	public async SearchBankByBik(bik: string): Promise<BankSearch> {
		this.LastError = null;

		let url = this.ApiDomain + `api/Document/getReceiverBanks/${bik}?v=${this.ApiVersion}`;

		try {
			let result: BankSearch[] = await this.GetAsync(url, this.HttpOptions);

			if (null !== result && result.length > 0) {
				return result[0];
			}
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return null;
	}
}
