import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Partner} from "../classes/interfaces/api-partner.interface";
import {ServiceBase} from "./service-base";
import {StoreService} from "./state.service";

@Injectable()
export class PartnersService extends ServiceBase {
	public LastError: object = null;

	constructor(HttpClientInstance: HttpClient, public Store: StoreService) {
		super(HttpClientInstance);
	}

	public async GetListAsync(): Promise<Partner[]> {
		this.LastError = null;

		let url = this.ApiDomain + `api/EDOWAR/partners/partners?v=${this.ApiVersion}`;

		try {
			let result: Partner[] = await this.GetAsync(url, this.HttpOptions);

			if (!result || 0 === result.length) {
				return null;
			}

			return result;
		} catch (error: any) {
			if (401 === error.status) {
				document.location.href = "/";
			}
			this.LastError = error;
		}

		return [];
	}
}
