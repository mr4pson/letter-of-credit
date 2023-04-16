import { Observable } from 'rxjs';

import { SmbComponentInterface } from './smb-component.interface';
import { SmbDialogService } from './smb-dialog-service.interface';

export interface SmbDocumentFilterComponent extends SmbComponentInterface {
    popupService: {
        dialogService: SmbDialogService;
        submitPaymentOrder: () => Observable<any>;
    };
    newPayment: () => void;
}
