import { Observable } from 'rxjs';

export interface SmbAccountAuxService {
  accountStoreService: {
    accountApiService: {
      getCorpAccounts: () => Observable<any>;
    };
  };
  loadAccounts: (clientId: number, branchId: number) => Promise<any>;
}
