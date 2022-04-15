import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IssueSuccessComponent } from './issue-success/issue-success.component';
import { AccreditationAmountComponent } from './accreditation-amount/accreditation-amount.component';
import { СounterpartyComponent } from './counterparty/counterparty.component';
import { CounterpartyContractComponent } from './counterparty-contract/counterparty-contract.component';
import { AccreditationPeriodComponent } from './accreditation-period/accreditation-period.component';
import { SendApplicationComponent } from './send-application/send-application.component';

import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';
import { StoreService } from 'src/app/models/state.service';
import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SuccessModalComponent, SuccessModalType } from '@psb/fe-ui-kit/src/components/success-modal';
import { PsbDomHelper } from 'src/app/classes/psb-dom.helper';

@Component({
  selector: 'loc-issue',
  templateUrl: 'issue.component.html',
  styleUrls: ['issue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class IssueComponent implements OnInit {
  public allowIssue = false;
  public ButtonType = ButtonType;
  public currentStep = 5;
  public locInstance = {} as LetterOfCredit;

  @ViewChild(AccreditationAmountComponent) step1Component: AccreditationAmountComponent;
  @ViewChild(СounterpartyComponent) step2Component: СounterpartyComponent;
  @ViewChild(CounterpartyContractComponent) step3Component: CounterpartyContractComponent;
  @ViewChild(AccreditationPeriodComponent) step4Component: AccreditationPeriodComponent;
  @ViewChild(SendApplicationComponent) step5Component: SendApplicationComponent;

  constructor(
    private store: StoreService,
  ) { }

  ngOnInit(): void {
    const observer = new MutationObserver(() => {
      const newPaymentButton = PsbDomHelper.getNewPaymentButtonElement();
      if (null === newPaymentButton) {
        return;
      }

      if (null === PsbDomHelper.getNewLocPaymentButtonElement()) {
        this.createNewLocButton(newPaymentButton);
        this.allowIssue = false;
      }
    });

    // observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});

    this.store.setIssueComponent(this);
  }

  private createNewLocButton(newPaymentButton: Element): void {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-default', 'btn-default-left', 'waves-effect', 'new-payment', 'js-new-loc');
    btn.innerText = 'Новый покрытый аккредитив';
    btn.style.cssText = 'position: absolute;top: 51px;right: 0;';

    btn.addEventListener('click', () => {
      this.doOpenIssue();
    });

    newPaymentButton.after(btn);
  }

  public backEvent() {
    switch (this.currentStep) {
      case 1:
        this.closeIssue();
        break;
      case 2:
        this.currentStep = 1;
        break;
      case 3:
        this.currentStep = 2;
        break;
      case 4:
        this.currentStep = 3;
        break;
      case 5:
        this.currentStep = 4;
        break;
    }
  }

  public nextEvent() {
    switch (this.currentStep) {
      case 1:
        // if (!this.step1Component.isValid()) {
        //   return;
        // }

        // this.store.issueStep1Text =
        //   FormatHelper.getSumFormatted(Number(this.step1Component.issueSum)
          // + Number(this.step1Component.commission));

        // this.store.paymentSum = this.step1Component.issueSum;

        // this.currentStep = 2;
        break;
      case 2:
        // if (!this.step2Component.isValid()) {
        //   return;
        // }

        // this.store.issueStep2Text = this.locInstance.reciverName;

        // this.currentStep = 3;
        break;
      case 3:
        // if (!this.step3Component.isValid()) {
        //   return;
        // }

        // this.store.issueStep3Text = this.locInstance.contractDate.toLocaleDateString(
        //   'ru-RU',
        //   { year: 'numeric', month: 'long', day: 'numeric' },
        // );

        // this.currentStep = 4;
        break;
      case 4:
        // if (!this.step4Component.isValid()) {
        //   return;
        // }

        // this.store.issueStep4Text = `до ${this.locInstance?.endLocDate.toLocaleDateString(
        //   'ru-RU',
        //   { year: 'numeric', month: 'long', day: 'numeric' },
        // )}`;

        // this.currentStep = 5;
        break;
      case 5:
        // if (!this.step5Component.isValid()) {
        //   return;
        // }

        // this.openSuccessDialog();
        break;
    }
  }

  public doOpenIssue() {
    this.locInstance = new LetterOfCredit();
    if (this.store.allowIssue) {
      this.locInstance.reciverInn = this.store.reciverInn;
      this.locInstance.reciverName = this.store.reciverName;
      this.locInstance.reciverBankBik = this.store.reciverBankBik;
      this.locInstance.reciverBankName = this.store.reciverBankName;
      this.locInstance.reciverAccount = this.store.reciverAccount;
    } else {
      this.store.restoreDefaultState();
    }

    this.currentStep = 1;

    PsbDomHelper.hideDocuments();
    this.allowIssue = true;
  }

  private closeIssue() {
    this.allowIssue = false;
    PsbDomHelper.showDocuments();
  }
}
