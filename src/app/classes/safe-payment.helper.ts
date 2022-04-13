import {MatDialog} from "@angular/material/dialog";
import {BaseModalComponent} from "@psb/fe-ui-kit/src/components/base-modal";
import {SafePaymentComponent} from "../components/safepayment/safe-payment.component";
import {AccountService} from "../models/account.service";
import {StoreService} from "../models/state.service";
import {PaymentFields} from "./payment-fields";
import {PaymentForm} from "./payment-form";
import {SafePaymentButton} from "./safe-payment-button";

export class SafePaymentHelper {
	private PaymentForm: PaymentForm;

	private readonly NewSafePayButtonClassName = "js-new-button";
	private readonly OldPayButtonHideClassName = "hidden";

	constructor(
		private Store: StoreService,
		private Dialog: MatDialog,
		private AccountServiceInstance: AccountService,
	) {
		this.PaymentForm = new PaymentForm();
	}

	public HookMainPagePaymentButton(): void {
		const that = this;
		let listenerAdded = false;
		let observer = new MutationObserver(function () {
			if (document.location.pathname.indexOf("/main") < 0) {
				listenerAdded = false;
				return;
			}

			let newPaymentButton = that.PaymentForm.GetMainPagePaymentButtonElement();
			if (null === newPaymentButton) {
				listenerAdded = false;
				return;
			}

			if (listenerAdded) {
				return;
			}

			newPaymentButton.addEventListener("click", function () {
				that.Store.RestoreDefaultState();
				that.NewPaymentButtonListener(that);
			});

			listenerAdded = true;
		});

		observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
	}

	public HookDocPagePaymentButton(): void {
		const that = this;
		let listenerAdded = false;

		let observer = new MutationObserver(function () {
			if (document.location.pathname.indexOf("/documents") < 0) {
				listenerAdded = false;
				return;
			}

			let newPaymentButton = that.PaymentForm.GetDocPagePaymentButtonElement();
			if (null === newPaymentButton) {
				listenerAdded = false;
				return;
			}

			if (listenerAdded) {
				return;
			}

			newPaymentButton.addEventListener("click", function () {
				that.Store.RestoreDefaultState();
				that.NewPaymentButtonListener(that);
			});

			listenerAdded = true;
		});

		observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
	}

	private NewPaymentButtonListener(that: SafePaymentHelper): void {
		let element = that.PaymentForm.GetOverlayContainer();
		if (null !== element) {
			that.SetSavePaymentButtonsClickEvent(that);
			return;
		}

		let observer = new MutationObserver(function () {
			element = that.PaymentForm.GetOverlayContainer();
			if (null === element) {
				return;
			}

			observer.disconnect();
			that.SetSavePaymentButtonsClickEvent(that);
		});

		observer.observe(document.body, {"subtree": true, "childList": true});
	}
	private SetSavePaymentButtonsClickEvent(that: SafePaymentHelper): void {
		let observer = new MutationObserver(function () {
			let buttons = that.PaymentForm.GetSavePaymentButtons();

			if (null === buttons) {
				return;
			}

			observer.disconnect();

			for (let i = 0; i < buttons.length; i++) {
				let oldElement = buttons[i];

				let newElement = oldElement.cloneNode(true);

				(oldElement as HTMLElement)?.classList.add(that.OldPayButtonHideClassName);
				(newElement as HTMLElement)?.classList.add(that.NewSafePayButtonClassName);

				oldElement.parentNode.appendChild(newElement);

				newElement.addEventListener("click", function () {
					that.SavePaymentButtonsClickEventAsync(that);
				});
			}
		});

		observer.observe(that.PaymentForm.GetOverlayContainer(), {"subtree": true, "childList": true});
	}

	private async SavePaymentButtonsClickEventAsync(that: SafePaymentHelper) {
		if (!that.PaymentForm.IsValidForm()) {
			this.ClickSavePaymentButton(that);

			return;
		}

		that.Store.ReciverInn = that.PaymentForm.FormValues[PaymentFields.ReceiverInn];
		if (!await that.IsShowLoC(that)) {
			this.ClickSavePaymentButton(that);
			return;
		}

		that.Store.ReciverName = that.PaymentForm.FormValues[PaymentFields.ReceiverName];
		that.Store.ReciverBankBik = that.PaymentForm.FormValues[PaymentFields.ReceiverBankBik];
		that.Store.ReciverBankName = that.PaymentForm.FormValues[PaymentFields.ReceiverBankName];
		that.Store.ReciverAccount = that.PaymentForm.FormValues[PaymentFields.ReceiverAccount];
		if (!!that.PaymentForm.FormValues[PaymentFields.PaymentSum] && that.PaymentForm.FormValues[PaymentFields.PaymentSum].trim().length > 0) {
			that.Store.PaymentSum = parseInt(that.PaymentForm.FormValues[PaymentFields.PaymentSum].replace(/(\D)/g, ''));
		}

		that.OpenPaymentDialog(that);
	}

	public async IsShowLoC(that: SafePaymentHelper): Promise<boolean> {
		that.Store.OpenWaitDialog();

		if (!await that.AccountServiceInstance.GetAllowLoCAsync(that.Store.ReciverInn)) {
			if (null !== that.AccountServiceInstance.LastError) {
				alert("Не удалось получить информацию о возможности запроса аккредитива.");
			}

			that.Store.CloseWaitDialog();

			return false;
		}

		if (!await that.AccountServiceInstance.GetIsBadReliabilityAsync(that.Store.ReciverInn)) {
			if (null !== that.AccountServiceInstance.LastError) {
				alert("Не удалось получить информацию о рейтинге контрагента.");
			}

			that.Store.CloseWaitDialog();

			return false;
		}

		that.Store.CloseWaitDialog();

		return true;
	}

	private ClickSavePaymentButton(that: SafePaymentHelper) {
		let buttons = that.PaymentForm.GetSavePaymentButtons();
		if (null !== buttons && buttons.length > 0) {
			(buttons[0] as HTMLButtonElement)?.click();
		}
	}

	private OpenPaymentDialog(that: SafePaymentHelper): void {
		if (!that.PaymentForm.HidePaymentDialog()) {
			alert("Ошибка при переключении на запрос аккредитива.");
			return;
		}

		let exampleData: any = {
			title: "Рекомендуем безопасный платёж",
			component: SafePaymentComponent,
		};

		setTimeout(function () {
			that.Store.SafePaymentDialog = that.Dialog.open(BaseModalComponent, {
				data: {
					...exampleData,
				},
				panelClass: ["loc-overlay", "loc-payment"],
				backdropClass: "loc-backdrop"
			});

			that.Store.SafePaymentDialog.afterClosed().subscribe(result => {
				switch (result) {
					case SafePaymentButton.RefusePay:
						that.DoRefusePay(that);
						break;
					case false:
					case SafePaymentButton.OrdinalPay:
						that.DoOrdinalPay(that);
						break;
				}
			});
		}, 33);
	}
	private DoOrdinalPay(that: SafePaymentHelper) {
		let buttons = that.PaymentForm.GetSavePaymentButtons();
		for (let i = 0; i < buttons.length; i++) {
			let item = <HTMLButtonElement>buttons[i];
			if (!item.classList.contains(that.NewSafePayButtonClassName)) {
				item.classList.remove(that.OldPayButtonHideClassName);
				continue;
			}
			item.remove();
		}

		this.PaymentForm.ShowPaymentDialog();
	}
	private DoRefusePay(that: SafePaymentHelper) {
		that.PaymentForm.ClosePaymentDialog();
	}
}
