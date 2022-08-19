import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    readonly apiDomain = '/api/';
    readonly apiVersion = '1.51.0';

    getAccessToken(): string {
        return sessionStorage.getItem('auth.accessToken');
    }
    getClientID(): string {
        return sessionStorage.getItem('client.defaultClientId');
    }
    getAccountID(): string {
        return sessionStorage.getItem('client.selectedAccountId');
    }
    getDefaultAccountID(): string {
        return sessionStorage.getItem('client.defaultAccount');
    }
    getBranchID(): string {
        return sessionStorage.getItem('cert.defaultBranchId');
    }
}
