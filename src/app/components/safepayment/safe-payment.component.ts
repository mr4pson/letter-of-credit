import {Component, ViewChild, ViewEncapsulation} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ButtonSize, ButtonType} from "@psb/fe-ui-kit/src/components/button";
import {PaymentForm} from "src/app/classes/payment-form";
import {PsbDomHelper} from "src/app/classes/psb-dom.helper";
import {ReciverStatus} from "src/app/classes/reciver-status";
import {ReliableSign} from "src/app/classes/reliable-sign";
import {SafePaymentButton} from "src/app/classes/safe-payment-button";
import {AccountService} from "src/app/models/account.service";
import {StoreService} from "src/app/models/state.service";
import {SafePaymentEmailComponent} from "./safe-payment-email.component";

@Component({
	selector: "safe-payment",
	templateUrl: "safe-payment.component.html",
	styleUrls: ["safe-payment.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class SafePaymentComponent {
	@ViewChild(SafePaymentEmailComponent) EmailComponent: HTMLElement;

	public ButtonType = ButtonType;
	public ButtonSize = ButtonSize;

	public SPayGroup = new FormGroup({
		DontWantSafePayment: new FormControl(false),
	});

	public get IsShowAgenda(): boolean {
		return SafePayState.ShowAgenda == this.StateManager.State;
	}
	public get IsShowEmail(): boolean {
		return SafePayState.ShowEmail == this.StateManager.State;
	}

	private StateManager = new SafePaymentStateManager();

	constructor(
		public Store: StoreService,
		private AccountServiceInstance: AccountService,
	) { }

	public get SafePaymentButton() {
		return SafePaymentButton;
	}

	public CurrentReliableColor(): string {
		switch (this.Store.ReciverStatus) {
			case ReciverStatus.Unreliable:
				return ReliableSign.ReliableRed;
			case ReciverStatus.PartlyReliable:
				return ReliableSign.ReliableYellow;
			default:
				return ReliableSign.ReliableGray;
		}

	}

	public CurrentReliableText(): string {
		switch (this.Store.ReciverStatus) {
			case ReciverStatus.Unreliable:
				return ReliableSign.ReliableRedText;
			case ReciverStatus.PartlyReliable:
				return ReliableSign.ReliableYellowText;
			default:
				return ReliableSign.ReliableGrayText;
		}

	}

	public DoSafePay() {
		this.Store.SafePaymentDialog.close(SafePaymentButton.DoPay);

		let paymentForm = new PaymentForm();
		paymentForm.ClosePaymentDialog();

		this.Store.AllowIssue = true;

		let that = this;
		setTimeout(function () {
			if ("/documents" === document.location.pathname) {
				that.Store.OpenIssue();
				return;
			}

			if ("/main" === document.location.pathname) {
				let element = <HTMLElement>document.querySelector("a[smb-auto-test='root.main.documents']");
				if (!element) {
					alert("Не удалось открыть форму аккредитива.");
					return;
				}

				element.click();


				let observer = new MutationObserver(function () {
					let newPaymentButton = PsbDomHelper.GetNewPaymentButtonElement();
					if (null === newPaymentButton) {
						return;
					}

					that.Store.OpenIssue();

					observer.disconnect();
				});

				observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
			}
		}, 150);
	}

	public CloseDialog(payButton: SafePaymentButton = SafePaymentButton.OrdinalPay) {
		this.Store.SafePaymentDialog.close(payButton);
	}

	public TakeEmail(email: string): void {
		if ("" == email.trim()) {
			return;
		}

		this.Store.ClientEmail = email;

		this.StateManager.State = SafePayState.ShowAgenda;
	}

	public ShowEmail() {
		this.StateManager.State = SafePayState.ShowEmail;
	}

	private IsDisableOffersCalled = false;
	public async SetDisableOffers() {
		if (this.IsDisableOffersCalled) {
			return;
		}
		this.IsDisableOffersCalled = true;

		let result = await this.AccountServiceInstance.SetDisableLoCOffersAsync(this.Store.ReciverInn);
		if (!result && null !== this.AccountServiceInstance.LastError) {
			alert("Не удалось изменить режим предложения покрытого аккредитива.");
		}

		this.IsDisableOffersCalled = false;

		this.SPayGroup.controls.DontWantSafePayment.setValue(result);
	}
}

enum SafePayState {
	ShowAgenda,
	ShowEmail,
}

class SafePayStateTransition {
	public constructor(public State: SafePayState, public NextState: SafePayState) { }
}

class SafePaymentStateManager {
	private CurrentState: SafePayState = SafePayState.ShowAgenda;
	private Routes: SafePayStateTransition[] = [];
	public get State() {
		return this.CurrentState;
	}
	public set State(state: SafePayState) {
		let transition = this.Routes.filter(t => t.State === this.CurrentState && t.NextState === state);
		if (null === transition || 0 == transition.length) {
			return;
		}

		this.CurrentState = state;
	}
	public constructor() {
		this.Routes.push(new SafePayStateTransition(SafePayState.ShowAgenda, SafePayState.ShowEmail));
		this.Routes.push(new SafePayStateTransition(SafePayState.ShowEmail, SafePayState.ShowAgenda));
	}
}
