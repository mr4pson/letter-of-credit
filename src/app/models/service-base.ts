import {HttpClient, HttpHeaders} from "@angular/common/http";

export abstract class ServiceBase {
	protected readonly ApiDomain = "https://psb.aiwoo.info/";

	protected readonly ApiVersion = "1.51.0";

	constructor(protected HttpClientInstance: HttpClient) { }

	protected get HttpOptions(): object {
		return {
			headers: new HttpHeaders({
				"Content-Type": "application/json",
				"Accept": "application/json",
				"Authorization": this.AuthorizationHeader(),
			}),
			withCredentials: true,
		};
	}

	protected async GetAsync(url: string, options?: any): Promise<any> {
		return await this.HttpClientInstance.get(url, options).toPromise();
	}

	protected async PostAsync(url: string, data?: any, options?: any): Promise<any> {
		return await this.HttpClientInstance.post(url, data, options).toPromise();
	}

	protected async PutAsync(url: string, data?: any, options?: any): Promise<any> {
		return await this.HttpClientInstance.put(url, data, options).toPromise();
	}

	protected async DeleteAsync(url: string, options?: any): Promise<any> {
		return await this.HttpClientInstance.delete(url, options).toPromise();
	}

	protected AuthorizationHeader = () => "Bearer " + window.sessionStorage.getItem("auth.accessToken");
	protected get ClientID(): string {
		return window.sessionStorage.getItem("client.defaultClientId");
	}
	protected get AccountID(): string {
		return window.sessionStorage.getItem("client.selectedAccountId");
	}
	protected get BranchID(): string {
		return window.sessionStorage.getItem("cert.defaultBranchId");
	}
}
