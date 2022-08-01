import { SmbAccountAuxService } from './smb-account-aux-service.interface';
import { SmbComponentInterface } from './smb-component.interface';

export interface SmbDocumentsComponent extends SmbComponentInterface {
    accountAuxService: SmbAccountAuxService;
    clientInfoService: {
        getDefaultClientId: () => number;
        getDefaultBranchId: () => number;
    };
}
