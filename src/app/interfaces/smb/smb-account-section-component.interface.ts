import { Observable } from 'rxjs';

import { SmbAccountAuxService } from './smb-account-aux-service.interface';
import { SmbComponentInterface } from './smb-component.interface';
import { SmbDialogService } from './smb-dialog-service.interface';

export interface SmbAccountSectionComponent extends SmbComponentInterface {
  accountAuxService: SmbAccountAuxService;
  popupService: {
    dialogService: SmbDialogService;
    submitPaymentOrder: () => Observable<any>;
  };
  newPayment: () => void;
}
