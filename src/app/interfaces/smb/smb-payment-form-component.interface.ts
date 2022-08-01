import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { SmbComponentInterface } from './smb-component.interface';
import { SmbDialogService } from './smb-dialog-service.interface';
import { SmbPayment } from './smb-payment.interface';
import { SmbSpinnerService } from './smb-spinner-service.interface';

export interface SmbPaymentFormComponent extends SmbComponentInterface {
    paymentForm: FormGroup;
    spinnerService: SmbSpinnerService;
    paymentFormContext: string;
    popupService: {
        dialogService: SmbDialogService;
    };
    payment: SmbPayment;
    router: Router;
    validate: () => boolean;
}
