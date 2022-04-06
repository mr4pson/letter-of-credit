import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import { BaseModalComponent } from '@psb/fe-ui-kit';
import {SafePaymentHelper} from "./classes/safe-payment.helper";
import { SafePaymentComponent } from './components/safepayment/safe-payment.component';
import {AccountService} from "./models/account.service";
import {StoreService} from './models/state.service';

@Component({
	selector: "loc-inner",
	templateUrl: "app.component.html",
	styleUrls: []
})
export class AppComponent {
	private SafePaymentHelper: SafePaymentHelper;

	constructor(
		private Store: StoreService,
		private Dialog: MatDialog,
		private AccountServiceInstance: AccountService,
	) {
		this.Store.Dialog = this.Dialog;

		this.SafePaymentHelper = new SafePaymentHelper(this.Store, this.Dialog, this.AccountServiceInstance);
		this.SafePaymentHelper.HookMainPagePaymentButton();
		this.SafePaymentHelper.HookDocPagePaymentButton();

		let exampleData: any = {
			title: "Рекомендуем безопасный платёж",
			component: SafePaymentComponent,
		};

		this.Store.SafePaymentDialog = this.Dialog.open(BaseModalComponent, {
			data: {
				...exampleData,
			},
			panelClass: ["loc-overlay", "loc-payment"],
			backdropClass: "loc-backdrop"
		});
	}
}
