import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { ReciverStatus } from '../classes/reciver-status';
import { SafePaymentButton } from '../classes/safe-payment-button';
import { IssueComponent } from '../components/issue/issue.component';
import { WaitSpinnerComponent } from '../components/wait-spinner/wait-spinner.component';

import { BaseModalComponent } from '@psb/fe-ui-kit/src/components/base-modal';
import { SuccessModalComponent } from '@psb/fe-ui-kit/src/components/success-modal';

@Injectable()
export class StoreService {
  public dialog: MatDialog;
  public safePaymentDialog: MatDialogRef<BaseModalComponent, any>;
  private waitDialog: MatDialogRef<WaitSpinnerComponent, any>;
  private successIsuueDialog: MatDialogRef<SuccessModalComponent, any>;

  public clientEmail: string;

  public reciverStatus: ReciverStatus = ReciverStatus.Unknown;
  public reciverInn = '';
  public reciverName = '';
  public reciverBankBik = '';
  public reciverBankName = '';
  public reciverAccount = '';
  public paymentSum = 0;

  public allowIssue = false;

  public issueStep1Text = '';
  public issueStep2Text = '';
  public issueStep3Text = '';
  public issueStep4Text = '';

  private issueComponent: IssueComponent;

  public restoreDefaultState() {
    this.safePaymentDialog?.close(SafePaymentButton.RefusePay);
    this.safePaymentDialog = null;

    this.clientEmail = '';

    this.reciverInn = '';
    this.reciverStatus = ReciverStatus.Unknown;
    this.reciverName = '';
    this.reciverBankBik = '';
    this.reciverBankName = '';
    this.reciverAccount = '';
    this.paymentSum = 0;

    this.allowIssue = false;
  }

  public openWaitDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = ['loc-overlay-spinner', 'hide-scrollbar'];
    dialogConfig.backdropClass = 'loc-backdrop';

    if (null !== this.waitDialog) {
      this.closeWaitDialog();
    }

    this.waitDialog = this.dialog?.open(WaitSpinnerComponent, dialogConfig);
  }

  public closeWaitDialog() {
    this.waitDialog?.close();
  }

  public setSuccessDialog(dialog: MatDialogRef<any, any>) {
    this.successIsuueDialog = dialog;
  }

  public closeSuccessDialog() {
    this.successIsuueDialog?.close();
    this.successIsuueDialog = null;
  }
  public setIssueComponent(instance: IssueComponent): void {
    this.issueComponent = instance;
  }

  public openIssue(): void {
    this.issueComponent?.doOpenIssue();
  }
}
