import { PaymentFields } from './payment-fields';

export class PaymentForm {
  public formValues: {[key: string]: string} = {};

  private formSelectors: {[key: string]: string} = {};

  constructor() {
    this.formSelectors[PaymentFields.DocumentNumber] = 'smb-payment-form [smb-auto-test=payments-form-number] input';
    this.formSelectors[PaymentFields.ReceiverInn] = 'smb-payment-form [formcontrolname=inn] input';
    this.formSelectors[PaymentFields.ReceiverName] = 'smb-payment-form [formcontrolname=shortName] input';
    this.formSelectors[PaymentFields.ReceiverAccount] = 'smb-payment-form input[name=receiverAccount]';
    this.formSelectors[PaymentFields.ReceiverBankBik] = 'smb-payment-form input[name=receiverBankBik]';
    this.formSelectors[PaymentFields.PaymentDestination] = 'smb-payment-form [name=paymentDestination] textarea';
    this.formSelectors[PaymentFields.PaymentSum] = 'smb-payment-form [formcontrolname=paymentSum] input';
  }

  public isValidForm(): boolean {
    /* let invalidFields = document.querySelectorAll("smb-payment-form input.ng-invalid");
		if (null !== invalidFields || invalidFields.length > 0) {
			return false;
		} */

    const fields = Object.values(PaymentFields) as string[];

    // tslint:disable-next-line: forin
    for (const index in fields) {
      const fieldName = fields[index];

      const selector = this.formSelectors[fieldName];
      if (selector) {
        const fieldValue = document.querySelector(selector) as HTMLInputElement;
        if (null === fieldValue || '' === fieldValue.value.trim()) {
          // TODO: ошибка поиска поля
          continue;
          // return false;
        }

        this.formValues[fieldName] = fieldValue.value.trim();
      }
    }

    this.formValues[PaymentFields.ReceiverBankName] =
      document.querySelector('smb-payment-form .bank-name')?.textContent?.trim();

    return true;
  }


  public hidePaymentDialog(): boolean {
    const dialog = document.querySelector('smb-payment-form')?.closest('.cdk-overlay-container');
    if (null === dialog) {
      return false;
    }

    dialog.classList.remove('hidden');
    dialog.classList.add('hidden');
    return true;
  }

  public showPaymentDialog(): boolean {
    const dialog = document.querySelector('smb-payment-form')?.closest('.cdk-overlay-container');
    if (null === dialog) {
      return false;
    }

    dialog.classList.remove('hidden');
    return true;
  }

  public closePaymentDialog(): boolean {
    const dialog = document.querySelector('smb-payment-form')?.closest('.cdk-overlay-container');
    if (null === dialog) {
      return false;
    }

    const closeButton = document.querySelector('smb-payment-form .icon.smb-close.close') as HTMLLinkElement;
    if (null === closeButton) {
      return false;
    }

    closeButton.click();

    setTimeout(() => {
      dialog.classList.remove('hidden');
    },         100);

    return true;
  }

  public getMainPagePaymentButtonElement(): Element | null {
    return document.querySelector('smb-account-section-top-action-panel .account-section-top-action-panel button.btn-primary');
  }

  public getDocPagePaymentButtonElement(): Element | null {
    return document.querySelector('smb-document-filter .btn.btn-default.new-payment');
  }

  public getSavePaymentButtons(): NodeList | null {
    return document.querySelectorAll('smb-payment-form smb-save-publish-block .action-buttons-row button');
  }

  public getOverlayContainer(): Element | null {
    return document.querySelector('.cdk-overlay-container .cdk-global-overlay-wrapper');
  }

}
