import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SafePaymentHelper } from './classes/safe-payment.helper';
import { SafePaymentComponent } from './components/safepayment/safe-payment.component';
import { AccountService } from './models/account.service';
import { StoreService } from './models/state.service';

import { BaseModalComponent } from '@psb/fe-ui-kit';

@Component({
  selector: 'loc-inner',
  templateUrl: 'app.component.html',
  styleUrls: [],
})
export class AppComponent {
  private safePaymentHelper: SafePaymentHelper;

  constructor(
    private store: StoreService,
    private dialog: MatDialog,
    private accountServiceInstance: AccountService,
  ) {
    this.store.dialog = this.dialog;

    this.safePaymentHelper = new SafePaymentHelper(
      this.store,
      this.dialog,
      this.accountServiceInstance,
    );
    this.safePaymentHelper.hookMainPagePaymentButton();
    this.safePaymentHelper.hookDocPagePaymentButton();

    const exampleData: any = {
      title: 'Рекомендуем безопасный платёж',
      component: SafePaymentComponent,
    };

    this.store.safePaymentDialog = this.dialog.open(BaseModalComponent, {
      data: {
        ...exampleData,
      },
      panelClass: ['loc-overlay', 'loc-payment'],
      backdropClass: 'loc-backdrop',
    });
  }
}
