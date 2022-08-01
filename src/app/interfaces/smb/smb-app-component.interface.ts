import { Router } from '@angular/router';
import { SmbAccountAuxService } from './smb-account-aux-service.interface';

import { SmbAlertingService } from './smb-alerting-service.interface';
import { SmbComponentInterface } from './smb-component.interface';

export interface SmbAppComponent extends SmbComponentInterface {
    router: Router;
    alertingService: SmbAlertingService;
    accountAuxService: SmbAccountAuxService;
    clientInfoService: {
        getDefaultClientId: () => number;
        getDefaultBranchId: () => number;
    };
}
