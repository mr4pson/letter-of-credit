import { Observable } from 'rxjs';

export interface SmbAccountAuxService {
  accountStoreService: {
    observable: Observable<any>;
  };
  loadAccounts: (clientId: number, branchId: number) => Promise<any>;
}
