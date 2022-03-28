import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {SafePaymentHelper} from "./classes/safe-payment.helper";
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
	}
}
