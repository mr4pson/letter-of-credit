import {PaymentFields} from "./payment-fields";

export class PaymentForm {
	public FormValues: {[key: string]: string} = {};

	private FormSelectors: {[key: string]: string} = {};

	constructor() {
		this.FormSelectors[PaymentFields.DocumentNumber] = "smb-payment-form [smb-auto-test=payments-form-number] input";
		this.FormSelectors[PaymentFields.ReceiverInn] = "smb-payment-form [formcontrolname=inn] input";
		this.FormSelectors[PaymentFields.ReceiverName] = "smb-payment-form [formcontrolname=shortName] input";
		this.FormSelectors[PaymentFields.ReceiverAccount] = "smb-payment-form input[name=receiverAccount]";
		this.FormSelectors[PaymentFields.ReceiverBankBik] = "smb-payment-form input[name=receiverBankBik]";
		this.FormSelectors[PaymentFields.PaymentDestination] = "smb-payment-form [name=paymentDestination] textarea";
		this.FormSelectors[PaymentFields.PaymentSum] = "smb-payment-form [formcontrolname=paymentSum] input";
	}

	public IsValidForm(): boolean {
		/* let invalidFields = document.querySelectorAll("smb-payment-form input.ng-invalid");
		if (null !== invalidFields || invalidFields.length > 0) {
			return false;
		} */

		let fields = <string[]>Object.values(PaymentFields);

		for (let index in fields) {
			let fieldName = fields[index];

			let selector = this.FormSelectors[fieldName];
			if (selector) {
				let fieldValue = <HTMLInputElement>document.querySelector(selector);
				if (null === fieldValue || "" === fieldValue.value.trim()) {
					// TODO: ошибка поиска поля
					continue;
					// return false;
				}

				this.FormValues[fieldName] = fieldValue.value.trim();
			}
		}

		this.FormValues[PaymentFields.ReceiverBankName] = document.querySelector("smb-payment-form .bank-name")?.textContent?.trim();

		return true;
	}


	public HidePaymentDialog(): boolean {
		let dialog = document.querySelector("smb-payment-form")?.closest(".cdk-overlay-container");
		if (null === dialog) {
			return false;
		}

		dialog.classList.remove("hidden");
		dialog.classList.add("hidden");
		return true;
	}

	public ShowPaymentDialog(): boolean {
		let dialog = document.querySelector("smb-payment-form")?.closest(".cdk-overlay-container");
		if (null === dialog) {
			return false;
		}

		dialog.classList.remove("hidden");
		return true;
	}

	public ClosePaymentDialog(): boolean {
		let dialog = document.querySelector("smb-payment-form")?.closest(".cdk-overlay-container");
		if (null === dialog) {
			return false;
		}

		let closeButton = <HTMLLinkElement>document.querySelector("smb-payment-form .icon.smb-close.close");
		if (null === closeButton) {
			return false;
		}

		closeButton.click();

		setTimeout(function () {
			dialog.classList.remove("hidden");
		}, 100);

		return true;
	}

	public GetMainPagePaymentButtonElement(): Element | null {
		return document.querySelector("smb-account-section-top-action-panel .account-section-top-action-panel button.btn-primary");
	}

	public GetDocPagePaymentButtonElement(): Element | null {
		return document.querySelector("smb-document-filter .btn.btn-default.new-payment");
	}

	public GetSavePaymentButtons(): NodeList | null {
		return document.querySelectorAll("smb-payment-form smb-save-publish-block .action-buttons-row button");
	}

	public GetOverlayContainer(): Element | null {
		return document.querySelector(".cdk-overlay-container .cdk-global-overlay-wrapper");
	}

}
