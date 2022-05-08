import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { SafePaymentEmailComponent } from './safe-payment-email/safe-payment-email.component';
import { SafePayStates } from './enums/safe-payment.enum';
import { SafePaymentStateManagerService } from './services/safe-payment-state-manager.service';
import { Page, paths } from '../issue/constants/routes';

import { ButtonSize, ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { ReciverStatus } from 'src/app/enums/reciver-status.enum';
import { ReliableSign } from 'src/app/modules/safepayment/enums/reliable-sign.enum';
import { SafePaymentButton } from 'src/app/enums/safe-payment-button.enum';
import { AccountService } from 'src/app/services/account.service';
import { StoreService } from 'src/app/services/store.service';
import { BaseModalComponent } from '@psb/fe-ui-kit';
import { ErrorHandlerService } from 'src/app/services';

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

  private isDisableOffersCalled = false;

  constructor(
    private store: StoreService,
    private accountServiceInstance: AccountService,
    private stateManager: SafePaymentStateManagerService,
    private dialogRef: MatDialogRef<BaseModalComponent>,
    private router: Router,
    private errorHandler: ErrorHandlerService,
  ) { }

  public getReliableColor(): string {
    switch (this.store.reciverStatus) {
      case ReciverStatus.Unreliable:
        return ReliableSign.reliableRed;

      case ReciverStatus.PartlyReliable:
        return ReliableSign.reliableYellow;

      default:
        return ReliableSign.reliableGray;
    }
  }

  public getReliableText(): string {
    switch (this.store.reciverStatus) {
      case ReciverStatus.Unreliable:
        return ReliableSign.reliableRedText;

      case ReciverStatus.PartlyReliable:
        return ReliableSign.reliableYellowText;

      default:
        return ReliableSign.reliableGrayText;
    }
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

  public setDisableOffers() {
    if (this.isDisableOffersCalled) {
      return;
    }

    this.isDisableOffersCalled = true;

    this.accountServiceInstance.setDisableLoCOffers(this.store.letterOfCredit.reciverInn).pipe(
      tap((response) => {
        this.isDisableOffersCalled = false;
        this.sPayGroup.controls.dontWantSafePayment.setValue(response);
      }),
      catchError(() => {
        this.errorHandler.showErrorMesssage('Не удалось изменить режим предложения покрытого аккредитива.');

        return of(false);
      }),
    );
  }
}
