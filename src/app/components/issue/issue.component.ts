import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FormatHelper} from "src/app/classes/format-helper";
import {LetterOfCredit} from "src/app/models/letter-of-credit.model";
import {StoreService} from "src/app/models/state.service";
import {IssueSuccessComponent} from "./issue-success.component";
import {IssueStep1Component} from "./issue-step1.component";
import {IssueStep2Component} from "./issue-step2.component";
import {IssueStep3Component} from "./issue-step3.component";
import {IssueStep4Component} from "./issue-step4.component";
import {IssueStep5Component} from "./issue-step5.component";
import {ButtonType} from "@psb/fe-ui-kit/src/components/button";
import {SuccessModalComponent, SuccessModalType} from "@psb/fe-ui-kit/src/components/success-modal";
import {PsbDomHelper} from "src/app/classes/psb-dom.helper";

@Component({
	selector: "loc-issue",
	templateUrl: "issue.component.html",
	styleUrls: ["issue.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class IssueComponent implements OnInit {
	public AllowIssue = false;

	public ButtonType = ButtonType;

	public CurrentStep = 1;
	public LocInstance: LetterOfCredit;

	@ViewChild(IssueStep1Component) Step1Component: IssueStep1Component;
	@ViewChild(IssueStep2Component) Step2Component: IssueStep2Component;
	@ViewChild(IssueStep3Component) Step3Component: IssueStep3Component;
	@ViewChild(IssueStep4Component) Step4Component: IssueStep4Component;
	@ViewChild(IssueStep5Component) Step5Component: IssueStep5Component;

	constructor(
		private Store: StoreService,
		private Dialog: MatDialog,
	) { }

	ngOnInit(): void {
		const that = this;
		let observer = new MutationObserver(function () {
			let newPaymentButton = PsbDomHelper.GetNewPaymentButtonElement();
			if (null === newPaymentButton) {
				return;
			}

			if (null === PsbDomHelper.GetNewLocPaymentButtonElement()) {
				that.CreateNewLocButton(newPaymentButton, that);
				that.AllowIssue = false;
			}
		});

		observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});

		this.Store.SetIssueComponent(this);
	}

	private CreateNewLocButton(newPaymentButton: Element, that: IssueComponent): void {
		let btn = document.createElement("button");
		btn.classList.add("btn", "btn-default", "btn-default-left", "waves-effect", "new-payment", "js-new-loc");
		btn.innerText = "Новый покрытый аккредитив";
		btn.style.cssText = "position: absolute;top: 51px;right: 0;";

		btn.addEventListener("click", function () {
			that.DoOpenIssue();
		});

		newPaymentButton.after(btn);
	}

	public BackEvent() {
		switch (this.CurrentStep) {
			case 1:
				this.CloseIssue();
				break;
			case 2:
				this.CurrentStep = 1;
				break;
			case 3:
				this.CurrentStep = 2;
				break;
			case 4:
				this.CurrentStep = 3;
				break;
			case 5:
				this.CurrentStep = 4;
				break;
		}
	}

	public NextEvent() {
		switch (this.CurrentStep) {
			case 1:
				if (!this.Step1Component.IsValid()) {
					return;
				}

				this.Store.IssueStep1Text = FormatHelper.GetSumFormatted(Number(this.Step1Component.IssueSum) + Number(this.Step1Component.Commission));
				this.Store.PaymentSum = this.Step1Component.IssueSum;

				this.CurrentStep = 2;
				break;
			case 2:
				if (!this.Step2Component.IsValid()) {
					return;
				}

				this.Store.IssueStep2Text = this.LocInstance.ReciverName;

				this.CurrentStep = 3;
				break;
			case 3:
				if (!this.Step3Component.IsValid()) {
					return;
				}

				this.Store.IssueStep3Text = this.LocInstance.ContractDate.toLocaleDateString("ru-RU", {year: "numeric", month: "long", day: "numeric"});

				this.CurrentStep = 4;
				break;
			case 4:
				if (!this.Step4Component.IsValid()) {
					return;
				}

				this.Store.IssueStep4Text = "до " + this.LocInstance.EndLocDate.toLocaleDateString("ru-RU", {year: "numeric", month: "long", day: "numeric"});

				this.CurrentStep = 5;
				break;
			case 5:
				if (!this.Step5Component.IsValid()) {
					return;
				}

				this.OpenSuccessDialog();
				break;
		}
	}

	public DoOpenIssue() {
		this.LocInstance = new LetterOfCredit();
		if (this.Store.AllowIssue) {
			this.LocInstance.ReciverInn = this.Store.ReciverInn;
			this.LocInstance.ReciverName = this.Store.ReciverName;
			this.LocInstance.ReciverBankBik = this.Store.ReciverBankBik;
			this.LocInstance.ReciverBankName = this.Store.ReciverBankName;
			this.LocInstance.ReciverAccount = this.Store.ReciverAccount;
		} else {
			this.Store.RestoreDefaultState();
		}

		this.CurrentStep = 1;

		PsbDomHelper.HideDocuments();
		this.AllowIssue = true;
	}

	private OpenSuccessDialog() {
		this.CurrentStep = 1;

		let exampleData: any = {
			title: 'Заявка отправлена',
			component: IssueSuccessComponent,
		};

		const type = SuccessModalType.Succeed;

		let dialog = this.Dialog.open(SuccessModalComponent, {
			data: {
				...exampleData,
				type,
			},
			panelClass: ["loc-overlay", "hide-scrollbar"],
		});

		const that = this;

		dialog.afterClosed().subscribe(() => {
			that.AllowIssue = false;
			PsbDomHelper.ShowDocuments();
		});

		this.Store.SetSuccessDialog(dialog);
	}

	private CloseIssue() {
		this.AllowIssue = false;
		PsbDomHelper.ShowDocuments();
	}
}
