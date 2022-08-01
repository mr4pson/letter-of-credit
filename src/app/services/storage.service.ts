import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
    readonly apiDomain = 'https://psb.aiwoo.info/';
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
    getBranchID(): string {
        return sessionStorage.getItem('cert.defaultBranchId');
    }
}
