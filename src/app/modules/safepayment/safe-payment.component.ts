import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SafePaymentEmailComponent } from './safe-payment-email/safe-payment-email.component';

import { ButtonSize, ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { PaymentForm } from 'src/app/classes/payment-form';
import { PsbDomHelper } from 'src/app/classes/psb-dom.helper';
import { ReciverStatus } from 'src/app/classes/reciver-status';
import { ReliableSign } from 'src/app/classes/reliable-sign';
import { SafePaymentButton } from 'src/app/classes/safe-payment-button';
import { AccountService } from 'src/app/services/account.service';
import { StoreService } from 'src/app/models/state.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


enum SafePayState {
  ShowAgenda,
  ShowEmail,
}

class SafePayStateTransition {
  public constructor(public state: SafePayState, public nextState: SafePayState) { }
}

class SafePaymentStateManager {
  private currentState: SafePayState = SafePayState.ShowAgenda;
  private routes: SafePayStateTransition[] = [];
  public get State() {
    return this.currentState;
  }
  public set State(state: SafePayState) {
    const transition = this.routes.filter(t => t.state === this.currentState && t.nextState === state);
    if (!transition || transition.length === 0) {
      return;
    }

    this.currentState = state;
  }
  public constructor() {
    this.routes.push(new SafePayStateTransition(SafePayState.ShowAgenda, SafePayState.ShowEmail));
    this.routes.push(new SafePayStateTransition(SafePayState.ShowEmail, SafePayState.ShowAgenda));
  }
}


@Component({
  selector: 'safe-payment',
  templateUrl: 'safe-payment.component.html',
  styleUrls: ['safe-payment.component.scss'],
})
export class SafePaymentComponent {
  @ViewChild(SafePaymentEmailComponent) emailComponent: HTMLElement;

  public get IsShowAgenda(): boolean {
    return SafePayState.ShowAgenda === this.stateManager.State;
  }
  public get IsShowEmail(): boolean {
    return SafePayState.ShowEmail === this.stateManager.State;
  }
  public get SafePaymentButton() {
    return SafePaymentButton;
  }
  public ButtonType = ButtonType;
  public ButtonSize = ButtonSize;
  public sPayGroup = new FormGroup({
    DontWantSafePayment: new FormControl(false),
  });

  private stateManager = new SafePaymentStateManager();
  private isDisableOffersCalled = false;

  constructor(
    public store: StoreService,
    private accountServiceInstance: AccountService,
  ) { }

  public currentReliableColor(): string {
    switch (this.store.reciverStatus) {
      case ReciverStatus.Unreliable:
        return ReliableSign.reliableRed;
      case ReciverStatus.PartlyReliable:
        return ReliableSign.reliableYellow;
      default:
        return ReliableSign.reliableGray;
    }

  }

  public currentReliableText(): string {
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
    this.store.safePaymentDialog.close(SafePaymentButton.DoPay);

    const paymentForm = new PaymentForm();
    paymentForm.closePaymentDialog();

    this.store.allowIssue = true;

    setTimeout(() => {
      if (document.location.pathname === '/documents') {
        this.store.openIssue();
        return;
      }

      if ('/main' === document.location.pathname) {
        const element = document.querySelector('a[smb-auto-test=\'root.main.documents\']') as HTMLElement;
        if (!element) {
          alert('Не удалось открыть форму аккредитива.');
          return;
        }

        element.click();

        const observer = new MutationObserver(function () {
          const newPaymentButton = PsbDomHelper.getNewPaymentButtonElement();
          if (null === newPaymentButton) {
            return;
          }

          this.Store.OpenIssue();

          observer.disconnect();
        });

        observer.observe(document.querySelector('smb-app'), { subtree: true, childList: true });
      }
    },         150);
  }

  public closeDialog(payButton: SafePaymentButton = SafePaymentButton.OrdinalPay) {
    this.store.safePaymentDialog.close(payButton);
  }

  public takeEmail(email: string): void {
    if (email.trim() === '') {
      return;
    }

    this.store.clientEmail = email;

    this.stateManager.State = SafePayState.ShowAgenda;
  }

  public showEmail() {
    this.stateManager.State = SafePayState.ShowEmail;
  }
  public async setDisableOffers() {
    if (this.isDisableOffersCalled) {
      return;
    }
    this.isDisableOffersCalled = true;

    const result = await this.accountServiceInstance.setDisableLoCOffers(this.store.reciverInn).pipe(
      catchError(() => {
        return of(false);
      }),
    );
    if (!result && null !== this.accountServiceInstance.lastError) {
      alert('Не удалось изменить режим предложения покрытого аккредитива.');
    }

    this.isDisableOffersCalled = false;

    this.sPayGroup.controls.DontWantSafePayment.setValue(result);
  }
}
