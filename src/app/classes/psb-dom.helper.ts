export class PsbDomHelper {
  public static getNewPaymentButtonElement(): Element | null {
    return document.querySelector('.col-new-payment button.new-payment');
  }

  public static getNewLocPaymentButtonElement(): Element | null {
    return document.querySelector('.col-new-payment button.new-payment.js-new-loc');
  }
  public static hideDocuments(): void {
    document.querySelector('smb-documents')?.classList.add('hidden');
  }

  public static showDocuments(): void {
    document.querySelector('smb-documents')?.classList.remove('hidden');
  }
}
