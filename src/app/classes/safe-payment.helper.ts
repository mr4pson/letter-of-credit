import { MatDialog } from '@angular/material/dialog';

import { SafePaymentComponent } from '../components/safepayment/safe-payment.component';
import { AccountService } from '../models/account.service';
import { StoreService } from '../models/state.service';
import { PaymentFields } from './payment-fields';
import { PaymentForm } from './payment-form';
import { SafePaymentButton } from './safe-payment-button';

import { BaseModalComponent } from '@psb/fe-ui-kit/src/components/base-modal';

export class SafePaymentHelper {
  private paymentForm: PaymentForm;

  private readonly newSafePayButtonClassName = 'js-new-button';
  private readonly oldPayButtonHideClassName = 'hidden';

  constructor(
    private store: StoreService,
    private dıalog: MatDialog,
    private accountServiceInstance: AccountService,
  ) {
    this.paymentForm = new PaymentForm();
  }

  public hookMainPagePaymentButton(): void {
    let listenerAdded = false;
    const observer = new MutationObserver(() => {
      if (document.location.pathname.indexOf('/main') < 0) {
        listenerAdded = false;
        return;
      }

      const newPaymentButton = this.paymentForm.getMainPagePaymentButtonElement();
      if (null === newPaymentButton) {
        listenerAdded = false;
        return;
      }

      if (listenerAdded) {
        return;
      }

      newPaymentButton.addEventListener('click', () => {
        this.store.restoreDefaultState();
        this.newPaymentButtonListener();
      });

      listenerAdded = true;
    });

    // observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
  }

  public hookDocPagePaymentButton(): void {
    let listenerAdded = false;

    const observer = new MutationObserver(() => {
      if (document.location.pathname.indexOf('/documents') < 0) {
        listenerAdded = false;
        return;
      }

      const newPaymentButton = this.paymentForm.getDocPagePaymentButtonElement();
      if (null === newPaymentButton) {
        listenerAdded = false;
        return;
      }

      if (listenerAdded) {
        return;
      }

      newPaymentButton.addEventListener('click', () => {
        this.store.restoreDefaultState();
        this.newPaymentButtonListener();
      });

      listenerAdded = true;
    });

    // observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
  }

  private newPaymentButtonListener(): void {
    let element = this.paymentForm.getOverlayContainer();
    if (null !== element) {
      this.setSavePaymentButtonsClickEvent();
      return;
    }

    const observer = new MutationObserver(() => {
      element = this.paymentForm.getOverlayContainer();
      if (null === element) {
        return;
      }

      observer.disconnect();
      this.setSavePaymentButtonsClickEvent();
    });

    observer.observe(document.body, { subtree: true, childList: true });
  }
  private setSavePaymentButtonsClickEvent(): void {
    const observer = new MutationObserver(() => {
      const buttons = this.paymentForm.getSavePaymentButtons();

      if (null === buttons) {
        return;
      }

      observer.disconnect();

      // tslint:disable-next-line: prefer-for-of
      buttons.forEach((oldElement) => {
        const newElement = oldElement.cloneNode(true);

        (oldElement as HTMLElement)?.classList.add(this.oldPayButtonHideClassName);
        (newElement as HTMLElement)?.classList.add(this.newSafePayButtonClassName);

        oldElement.parentNode.appendChild(newElement);

        newElement.addEventListener('click', () => {
          this.savePaymentButtonsClickEventAsync();
        });
      });
    });

    observer.observe(this.paymentForm.getOverlayContainer(), { subtree: true, childList: true });
  }

  private async savePaymentButtonsClickEventAsync() {
    if (!this.paymentForm.isValidForm()) {
      this.clickSavePaymentButton();

      return;
    }

    this.store.reciverInn = this.paymentForm.formValues[PaymentFields.ReceiverInn];
    if (!await this.isShowLoC()) {
      this.clickSavePaymentButton();
      return;
    }

    this.store.reciverName = this.paymentForm.formValues[PaymentFields.ReceiverName];
    this.store.reciverBankBik = this.paymentForm.formValues[PaymentFields.ReceiverBankBik];
    this.store.reciverBankName = this.paymentForm.formValues[PaymentFields.ReceiverBankName];
    this.store.reciverAccount = this.paymentForm.formValues[PaymentFields.ReceiverAccount];
    if (!!this.paymentForm.formValues[PaymentFields.PaymentSum]
      && this.paymentForm.formValues[PaymentFields.PaymentSum].trim().length > 0) {
      // tslint:disable-next-line: radix
      this.store.paymentSum = parseInt(this.paymentForm.formValues[PaymentFields.PaymentSum].replace(/(\D)/g, ''));
    }

    this.openPaymentDialog();
  }

  public async isShowLoC(): Promise<boolean> {
    this.store.openWaitDialog();

    const isLoCAllowed = await this.accountServiceInstance.getAllowLoC(this.store.reciverInn);
    if (!isLoCAllowed) {
      if (this.accountServiceInstance.lastError) {
        alert('Не удалось получить информацию о возможности запроса аккредитива.');
      }

      this.store.closeWaitDialog();

      return false;
    }

    const isBadReliability = await this.accountServiceInstance.getIsBadReliability(this.store.reciverInn);
    if (!isBadReliability) {
      if (this.accountServiceInstance.lastError) {
        alert('Не удалось получить информацию о рейтинге контрагента.');
      }

      this.store.closeWaitDialog();

      return false;
    }

    this.store.closeWaitDialog();

    return true;
  }

  private clickSavePaymentButton() {
    const buttons = this.paymentForm.getSavePaymentButtons();
    if (null !== buttons && buttons.length > 0) {
      (buttons[0] as HTMLButtonElement)?.click();
    }
  }

  private openPaymentDialog(): void {
    if (!this.paymentForm.hidePaymentDialog()) {
      alert('Ошибка при переключении на запрос аккредитива.');
      return;
    }

    const exampleData: any = {
      title: 'Рекомендуем безопасный платёж',
      component: SafePaymentComponent,
    };

    setTimeout(() => {
      this.store.safePaymentDialog = this.dıalog.open(BaseModalComponent, {
        data: {
          ...exampleData,
        },
        panelClass: ['loc-overlay', 'loc-payment'],
        backdropClass: 'loc-backdrop',
      });

      this.store.safePaymentDialog.afterClosed().subscribe((result) => {
        switch (result) {
          case SafePaymentButton.RefusePay:
            this.doRefusePay();
            break;
          case false:
          case SafePaymentButton.OrdinalPay:
            this.doOrdinalPay();
            break;
        }
      });
    },         33);
  }
  private doOrdinalPay() {
    const buttons = this.paymentForm.getSavePaymentButtons();
    buttons.forEach((button: HTMLButtonElement) => {
      if (!button.classList.contains(this.newSafePayButtonClassName)) {
        button.classList.remove(this.oldPayButtonHideClassName);
        return;
      }
      button.remove();
    });


    this.paymentForm.showPaymentDialog();
  }
  private doRefusePay() {
    this.paymentForm.closePaymentDialog();
  }
}
