import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { SelectedItem } from "@psb/fe-ui-kit/src/components/input-select";
import { getMinMaxFormControlValidator } from "@psb/validations/minMax";
import { getRequiredFormControlValidator } from "@psb/validations/required/validation";

import { FormatHelper } from "src/app/classes/format-helper";
import { AccountService } from "src/app/models/account.service";
import { ClientAccountsService } from "src/app/models/client-accounts.service";
import { StoreService } from "src/app/models/state.service";

@Component({
	selector: "accreditation-amount",
	templateUrl: "accreditation-amount.component.html",
	styleUrls: ["accreditation-amount.component.scss"],
})
export class AccreditationAmountComponent implements OnInit {
	public Issue1Group = new FormGroup({
		IssueSum: new FormControl("", {
			validators: [
				getRequiredFormControlValidator("Укажите сумму аккредитива"),
				getMinMaxFormControlValidator({
					min: 1,
					max: 1_000_000_000_000,
					errorMessage: "Укажите сумму аккредитива",
				}),
			],
			updateOn: "blur",
		}),
		SelectedAccount: new FormControl(),
	});
	public Commission = 0;
	public FormattedCommission = "0,00";
	public Accounts: SelectedItem[] = [];

	constructor(
		private Store: StoreService,
		private AccountServiceInstance: AccountService,
		private ClientAccountsServiceInstance: ClientAccountsService
	) {}

	ngOnInit(): void {
		if (this.Store.PaymentSum > 0) {
			this.Issue1Group.controls.IssueSum.setValue(this.Store.PaymentSum);
		}

		this.FillAccountsAsync();

		var that = this;
		this.Issue1Group.get("IssueSum")?.valueChanges.subscribe(() => {
			that.FetchCommissionAsync();
		});

		if (this.Issue1Group.get("IssueSum").value > 0) {
			that.FetchCommissionAsync();
		}
	}

	public IsValid(): boolean {
		this.Issue1Group.controls.IssueSum.setValue(
			this.Issue1Group.controls.IssueSum.value.toString()
		);
		this.Issue1Group.controls.IssueSum.markAsTouched();

		return this.Issue1Group.controls.IssueSum.valid;
	}

	public get IssueSum(): number {
		return this.Issue1Group.controls.IssueSum.value;
	}

	private CommisionRequestStarted = false;
	private CommisionsHasDelayedRequest = false;
	public async FetchCommissionAsync() {
		if (!this.Issue1Group.controls.IssueSum.valid) {
			this.Commission = 0;
			this.FormattedCommission = FormatHelper.GetSumFormatted(
				this.Commission
			);
			return;
		}
		if (this.CommisionRequestStarted) {
			this.CommisionsHasDelayedRequest = true;
			return;
		}
		this.CommisionRequestStarted = true;
		let sum = this.Issue1Group.controls.IssueSum.value as number;
		let result: number = await this.AccountServiceInstance.GetCommision(sum).toPromise();
		if (null !== this.AccountServiceInstance.lastError) {
			alert("Ошибка при получении размера коммисии.");
		}
		this.Commission = result;
		this.FormattedCommission = FormatHelper.GetSumFormatted(
			this.Commission
		);
		this.CommisionRequestStarted = false;

		if (
			this.CommisionsHasDelayedRequest &&
			sum != (this.Issue1Group.controls.IssueSum.value as number)
		) {
			this.FetchCommissionAsync();
		}
		this.CommisionsHasDelayedRequest = false;
	}

	private async FillAccountsAsync() {
		let list =
			await this.ClientAccountsServiceInstance.FetchAccountsAsync();
		for (let index in list) {
			let instance: SelectedItem = {
				id: list[index].AccountCode,
				label: list[index].Title,
				value: list[index],
			};

			this.Accounts.push(instance);
		}

		if (this.Accounts.length > 0) {
			this.Issue1Group.controls.SelectedAccount.setValue(
				this.Accounts[0].label
			);
		}
	}

	public get AccountSum(): string {
		return this.Accounts.find(
			(e) => e.label == this.Issue1Group.controls.SelectedAccount.value
		)?.value.GetFormattedBalance();
	}
}
