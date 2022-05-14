import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Page, paths } from '../issue/constants/routes';
import { SafePayStates } from './enums/safe-payment.enum';
import { SafePaymentEmailComponent } from './safe-payment-email/safe-payment-email.component';
import { SafePaymentStateManagerService } from './services/safe-payment-state-manager.service';

import { BaseModalComponent } from '@psb/fe-ui-kit';
import { ButtonSize, ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SafePaymentButton } from 'src/app/enums/safe-payment-button.enum';
import { ReliableSign } from 'src/app/modules/safepayment/enums/reliable-sign.enum';
import { StoreService } from 'src/app/services/store.service';
import { RELIABLE_MAP } from './constants/reliable-map.constant';

@Component({
  selector: 'safe-payment',
  templateUrl: 'safe-payment.component.html',
  styleUrls: ['safe-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafePaymentComponent {
  @ViewChild(SafePaymentEmailComponent) emailComponent: HTMLElement;

  public safePaymentDialog: MatDialogRef<BaseModalComponent, any>;
  public get isShowAgenda(): boolean {
    return SafePayStates.ShowAgenda === this.stateManager.state;
  }
  public get isShowEmail(): boolean {
    return SafePayStates.ShowEmail === this.stateManager.state;
  }
  public SafePaymentButton = SafePaymentButton;
  public ButtonType = ButtonType;
  public ButtonSize = ButtonSize;
  public sPayGroup = new FormGroup({
    dontWantSafePayment: new FormControl(false),
  });
  public letterOfCredit = this.store.letterOfCredit;

  constructor(
    private store: StoreService,
    private stateManager: SafePaymentStateManagerService,
    private dialogRef: MatDialogRef<BaseModalComponent>,
    private router: Router,
  ) { }

  public getReliableColor(): string {
    return RELIABLE_MAP.color[this.store.reciverStatus] ?? ReliableSign.reliableGray;
  }

  public getReliableText(): string {
    return RELIABLE_MAP.text[this.store.reciverStatus] ?? ReliableSign.reliableGrayText;
  }

  public doSafePay() {
    this.dialogRef.close(SafePaymentButton.DoPay);
    this.store.isIssueVissible = true;
    this.router.navigateByUrl(paths[Page.ACCREDITATION_AMOUNT]);
  }

  public closeDialog(payButton: SafePaymentButton = SafePaymentButton.OrdinalPay) {
    this.dialogRef.close(payButton);
  }

  public takeEmail(email: string): void {
    if (email.trim() === '') {
      return;
    }

    this.store.clientEmail = email;
    this.stateManager.state = SafePayStates.ShowAgenda;
  }

  public showEmail() {
    this.stateManager.state = SafePayStates.ShowEmail;
  }
}
