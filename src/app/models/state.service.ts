import {Injectable} from "@angular/core";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {BaseModalComponent} from "@psb/fe-ui-kit/src/components/base-modal";
import {SuccessModalComponent} from "@psb/fe-ui-kit/src/components/success-modal";
import {ReciverStatus} from "../classes/reciver-status";
import {SafePaymentButton} from "../classes/safe-payment-button";
import {IssueComponent} from "../components/issue/issue.component";
import {WaitSpinnerComponent} from "../components/wait-spinner/wait-spinner.component";

@Injectable()
export class StoreService {
	public Dialog: MatDialog;
	public SafePaymentDialog: MatDialogRef<BaseModalComponent, any>;
	private WaitDialog: MatDialogRef<WaitSpinnerComponent, any>;
	private SuccessIsuueDialog: MatDialogRef<SuccessModalComponent, any>;

	public ClientEmail: string;

	public ReciverStatus: ReciverStatus = ReciverStatus.Unknown;
	public ReciverInn = "";
	public ReciverName = "";
	public ReciverBankBik = "";
	public ReciverBankName = "";
	public ReciverAccount = "";
	public PaymentSum = 0;

	public AllowIssue = false;

	public IssueStep1Text = "";
	public IssueStep2Text = "";
	public IssueStep3Text = "";
	public IssueStep4Text = "";

	public RestoreDefaultState() {
		this.SafePaymentDialog?.close(SafePaymentButton.RefusePay);
		this.SafePaymentDialog = null;

		this.ClientEmail = "";

		this.ReciverInn = "";
		this.ReciverStatus = ReciverStatus.Unknown;
		this.ReciverName = "";
		this.ReciverBankBik = "";
		this.ReciverBankName = "";
		this.ReciverAccount = "";
		this.PaymentSum = 0;

		this.AllowIssue = false;
	}

	public OpenWaitDialog() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.disableClose = true;
		dialogConfig.panelClass = ["loc-overlay-spinner", "hide-scrollbar"];
		dialogConfig.backdropClass = "loc-backdrop";

		if (null !== this.WaitDialog) {
			this.CloseWaitDialog();
		}

		this.WaitDialog = this.Dialog?.open(WaitSpinnerComponent, dialogConfig);
	}

	public CloseWaitDialog() {
		this.WaitDialog?.close();
	}

	public SetSuccessDialog(dialog: MatDialogRef<any, any>) {
		this.SuccessIsuueDialog = dialog;
	}

	public CloseSuccessDialog() {
		this.SuccessIsuueDialog?.close();
		this.SuccessIsuueDialog = null;
	}

	private IssueComponent: IssueComponent;
	public SetIssueComponent(instance: IssueComponent): void {
		this.IssueComponent = instance;
	}

	public OpenIssue(): void {
		this.IssueComponent?.DoOpenIssue();
	}
}
