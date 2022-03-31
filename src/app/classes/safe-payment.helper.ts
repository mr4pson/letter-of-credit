import {MatDialog} from "@angular/material/dialog";
import {BaseModalComponent} from "@psb/fe-ui-kit/src/components/base-modal";
import {SafePaymentComponent} from "../components/safepayment/safe-payment.component";
import {AccountService} from "../models/account.service";
import {StoreService} from "../models/state.service";
import {PaymentFields} from "./payment-fields";
import {PaymentForm} from "./payment-form";
import {SafePaymentButton} from "./safe-payment-button";

export class SafePaymentHelper {
	private paymentForm: PaymentForm;

	private readonly NewSafePayButtonClassName = "js-new-button";
	private readonly OldPayButtonHideClassName = "hidden";

	constructor(
		private store: StoreService,
		private dıalog: MatDialog,
		private accountServiceInstance: AccountService,
	) {
		this.paymentForm = new PaymentForm();
	}

	public HookMainPagePaymentButton(): void {
		let listenerAdded = false;
		let observer = new MutationObserver(() => {
			if (document.location.pathname.indexOf("/main") < 0) {
				listenerAdded = false;
				return;
			}

			let newPaymentButton = this.paymentForm.GetMainPagePaymentButtonElement();
			if (null === newPaymentButton) {
				listenerAdded = false;
				return;
			}

			if (listenerAdded) {
				return;
			}

			newPaymentButton.addEventListener("click", () => {
				this.store.RestoreDefaultState();
				this.NewPaymentButtonListener();
			});

			listenerAdded = true;
		});

		// observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
	}

	public HookDocPagePaymentButton(): void {
		let listenerAdded = false;

		let observer = new MutationObserver(() => {
			if (document.location.pathname.indexOf("/documents") < 0) {
				listenerAdded = false;
				return;
			}

			let newPaymentButton = this.paymentForm.GetDocPagePaymentButtonElement();
			if (null === newPaymentButton) {
				listenerAdded = false;
				return;
			}

			if (listenerAdded) {
				return;
			}

			newPaymentButton.addEventListener("click", () => {
				this.store.RestoreDefaultState();
				this.NewPaymentButtonListener();
			});

			listenerAdded = true;
		});

		// observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
	}

	private NewPaymentButtonListener(): void {
		let element = this.paymentForm.GetOverlayContainer();
		if (null !== element) {
			this.SetSavePaymentButtonsClickEvent();
			return;
		}

		let observer = new MutationObserver(() => {
			element = this.paymentForm.GetOverlayContainer();
			if (null === element) {
				return;
			}

			observer.disconnect();
			this.SetSavePaymentButtonsClickEvent();
		});

		observer.observe(document.body, {"subtree": true, "childList": true});
	}
	private SetSavePaymentButtonsClickEvent(): void {
		let observer = new MutationObserver(() => {
			let buttons = this.paymentForm.GetSavePaymentButtons();

			if (null === buttons) {
				return;
			}

			observer.disconnect();

			for (let i = 0; i < buttons.length; i++) {
				let oldElement = buttons[i];

				let newElement = oldElement.cloneNode(true);

				(oldElement as HTMLElement)?.classList.add(this.OldPayButtonHideClassName);
				(newElement as HTMLElement)?.classList.add(this.NewSafePayButtonClassName);

				oldElement.parentNode.appendChild(newElement);

				newElement.addEventListener("click", () => {
					this.SavePaymentButtonsClickEventAsync();
				});
			}
		});

		observer.observe(this.paymentForm.GetOverlayContainer(), {"subtree": true, "childList": true});
	}

	private async SavePaymentButtonsClickEventAsync() {
		if (!this.paymentForm.IsValidForm()) {
			this.ClickSavePaymentButton();

			return;
		}

		this.store.ReciverInn = this.paymentForm.FormValues[PaymentFields.ReceiverInn];
		if (!await this.IsShowLoC()) {
			this.ClickSavePaymentButton();
			return;
		}

		this.store.ReciverName = this.paymentForm.FormValues[PaymentFields.ReceiverName];
		this.store.ReciverBankBik = this.paymentForm.FormValues[PaymentFields.ReceiverBankBik];
		this.store.ReciverBankName = this.paymentForm.FormValues[PaymentFields.ReceiverBankName];
		this.store.ReciverAccount = this.paymentForm.FormValues[PaymentFields.ReceiverAccount];
		if (!!this.paymentForm.FormValues[PaymentFields.PaymentSum] && this.paymentForm.FormValues[PaymentFields.PaymentSum].trim().length > 0) {
			this.store.PaymentSum = parseInt(this.paymentForm.FormValues[PaymentFields.PaymentSum].replace(/(\D)/g, ''));
		}

		this.OpenPaymentDialog();
	}

	public async IsShowLoC(): Promise<boolean> {
		this.store.OpenWaitDialog();

		const isLoCAllowed = await this.accountServiceInstance.GetAllowLoC(this.store.ReciverInn);
		if (!isLoCAllowed) {
			if (this.accountServiceInstance.lastError) {
				alert("Не удалось получить информацию о возможности запроса аккредитива.");
			}
			
			this.store.CloseWaitDialog();

			return false;
		}

		const isBadReliability = await this.accountServiceInstance.GetIsBadReliability(this.store.ReciverInn);
		if (!isBadReliability) {
			if (this.accountServiceInstance.lastError) {
				alert("Не удалось получить информацию о рейтинге контрагента.");
			}

			this.store.CloseWaitDialog();

			return false;
		}

		this.store.CloseWaitDialog();

		return true;
	}

	private ClickSavePaymentButton() {
		let buttons = this.paymentForm.GetSavePaymentButtons();
		if (null !== buttons && buttons.length > 0) {
			(buttons[0] as HTMLButtonElement)?.click();
		}
	}

	private OpenPaymentDialog(): void {
		if (!this.paymentForm.HidePaymentDialog()) {
			alert("Ошибка при переключении на запрос аккредитива.");
			return;
		}

		let exampleData: any = {
			title: "Рекомендуем безопасный платёж",
			component: SafePaymentComponent,
		};

		setTimeout(() => {
			this.store.SafePaymentDialog = this.dıalog.open(BaseModalComponent, {
				data: {
					...exampleData,
				},
				panelClass: ["loc-overlay", "loc-payment"],
				backdropClass: "loc-backdrop"
			});

			this.store.SafePaymentDialog.afterClosed().subscribe(result => {
				switch (result) {
					case SafePaymentButton.RefusePay:
						this.DoRefusePay();
						break;
					case false:
					case SafePaymentButton.OrdinalPay:
						this.DoOrdinalPay();
						break;
				}
			});
		}, 33);
	}
	private DoOrdinalPay() {
		let buttons = this.paymentForm.GetSavePaymentButtons();
		for (let i = 0; i < buttons.length; i++) {
			let item = <HTMLButtonElement>buttons[i];
			if (!item.classList.contains(this.NewSafePayButtonClassName)) {
				item.classList.remove(this.OldPayButtonHideClassName);
				continue;
			}
			item.remove();
		}

		this.paymentForm.ShowPaymentDialog();
	}
	private DoRefusePay() {
		this.paymentForm.ClosePaymentDialog();
	}
}
