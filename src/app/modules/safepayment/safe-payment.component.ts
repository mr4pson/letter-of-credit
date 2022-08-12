import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Page, paths } from '../issue/constants/routes';
import { SafePayStates } from './enums/safe-payment.enum';
import { SafePaymentEmailComponent } from './components/safe-payment-email/safe-payment-email.component';
import { SafePaymentStateManagerService } from './services/safe-payment-state-manager.service';

import { DialogRefService } from '@psb/fe-ui-kit';
import { ButtonSize, ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SafePaymentButton } from 'src/app/enums/safe-payment-button.enum';
import { ReliableSign } from 'src/app/modules/safepayment/enums/reliable-sign.enum';
import { StoreService } from 'src/app/services/store.service';
import { RELIABLE_MAP } from './constants/reliable-map.constant';
import { SafePaymentFormField } from './enums/safe-payment-form-field.enum';
import { NgService } from 'src/app/services';
import { SafePaymentFormService } from './safe-payment-form.service';

@Component({
    selector: 'safe-payment',
    templateUrl: 'safe-payment.component.html',
    styleUrls: ['safe-payment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafePaymentComponent {
    @ViewChild(SafePaymentEmailComponent) emailComponent: HTMLElement;

    SafePaymentButton = SafePaymentButton;
    ButtonType = ButtonType;
    ButtonSize = ButtonSize;
    form = this.formService.createForm();
    SafePaymentFormField = SafePaymentFormField;
    letterOfCredit = this.store.letterOfCredit;
    SafePayStates = SafePayStates;

    constructor(
        public stateManager: SafePaymentStateManagerService,
        private store: StoreService,
        private dialogRef: DialogRefService<SafePaymentButton>,
        private router: Router,
        private formService: SafePaymentFormService,
        private ngService: NgService,
    ) { }

    getReliableColor(): string {
        return RELIABLE_MAP.color[this.store.reciverStatus] ?? ReliableSign.reliableGray;
    }

    getReliableText(): string {
        return RELIABLE_MAP.text[this.store.reciverStatus] ?? ReliableSign.reliableGrayText;
    }

    doSafePay() {
        this.dialogRef.close(SafePaymentButton.DoPay);
        this.ngService.hideSmbDocuments();
        this.store.isIssueVissible = true;
        this.router.navigateByUrl(paths[Page.ACCREDITATION_AMOUNT]);
        setTimeout(() => {
            this.ngService.scrollToTop();
        }, 200);
    }

    closeDialog(payButton: SafePaymentButton = SafePaymentButton.OrdinalPay) {
        this.dialogRef.close(payButton);
    }

    takeEmail(email: string): void {
        if (email.trim() === '') {
            return;
        }

        this.store.clientEmail = email;
        this.stateManager.state = SafePayStates.ShowAgenda;
    }

    showEmail() {
        this.stateManager.state = SafePayStates.ShowEmail;
    }

}
