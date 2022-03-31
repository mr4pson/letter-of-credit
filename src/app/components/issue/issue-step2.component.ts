import {Component, Input, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {InputAutocompleteComponent} from "@psb/fe-ui-kit/src/components/input-autocomplete/input-autocomplete.component";
import {getRequiredFormControlValidator} from '@psb/validations/required';
import { OnDestroyMixin, untilComponentDestroyed } from "@w11k/ngx-componentdestroyed";
import { tap } from "rxjs/operators";
import {Partner} from "src/app/classes/interfaces/api-partner.interface";
import {ClientSearch} from "src/app/classes/interfaces/client-search.interface";
import {AccountService} from "src/app/models/account.service";
import {LetterOfCredit} from "src/app/models/letter-of-credit.model";
import {PartnersService} from "src/app/models/partners.service";

@Component({
	selector: "loc-issue-step2",
	templateUrl: "issue-step2.component.html",
	styleUrls: ["issue-step2.component.scss"]
})
export class IssueStep2Component extends OnDestroyMixin implements OnInit {
	public Issue2Group = new FormGroup({
		InnControl: new FormControl('', [
			getRequiredFormControlValidator("Укажите ИНН контрагента"),
			this.InnSizeValidator,
		]),
		BikControl: new FormControl('', [
			getRequiredFormControlValidator("Укажите БИК банка получателя"),
		]),
		AccountControl: new FormControl('', [
			getRequiredFormControlValidator("Укажите счет получателя"),
			this.AccountValidator,
		]),
	});

	public FoundInnList: ClientSearch[] = [];
	public InnCompany = "";
	private CurrentSearchInn = "";
	private PartnerList: Partner[] = [];

	@Input() LocInstance: LetterOfCredit;

	constructor(
		private AccountServiceInstance: AccountService,
		private Partners: PartnersService,
	) { 
		super();
	}

	ngOnInit() {
		var that = this;

		if (this.LocInstance.ReciverInn.length > 0) {
			this.Issue2Group.controls.InnControl.setValue(this.LocInstance.ReciverInn);
		}

		let PrevReciverBik: string;
		this.Issue2Group.get("BikControl")?.valueChanges.subscribe(() => {
			if (PrevReciverBik === that.Issue2Group.controls.BikControl.value) {
				return;
			}

			PrevReciverBik = that.Issue2Group.controls.BikControl.value;

			if (9 == that.Issue2Group.controls.BikControl.value.length) {
				that.SearchBankAsync();
				return;
			}

			that.LocInstance.ReciverBankName = "";
		});

		this.Issue2Group.get("AccountControl")?.valueChanges.subscribe(() => {
			that.LocInstance.ReciverAccount = that.Issue2Group.controls.AccountControl.valid ?
				that.Issue2Group.controls.AccountControl.value : "";
		});

		this.CurrentSearchInn = "";

		this.Issue2Group.controls.InnControl.setValue(this.LocInstance.ReciverInn);
		this.InnCompany = this.LocInstance.ReciverName;

		this.Issue2Group.controls.BikControl.setValue(this.LocInstance.ReciverBankBik);
		this.Issue2Group.controls.AccountControl.setValue(this.LocInstance.ReciverAccount);

		this.InitPartnersAsync();
	}

	private async InitPartnersAsync() {
		if ("" == this.LocInstance.ReciverInn) {
			this.PartnerList = await this.Partners.GetListAsync();
		}
	}

	private InnSizeValidator(control: FormControl) {
		return control.value?.length > 0 && control.value.length != 10 && control.value.length != 12 ? {error: "Укажите ИНН 10 или 12 цифр"} : {};
	}

	private AccountValidator(control: FormControl) {
		let account: string = control.value?.replaceAll(" ", "");
		return account?.length > 0 && account.length != 20 ? {error: "Некорректный счёт получателя"} : {};
	}

	public IsValid(): boolean {
		this.Issue2Group.controls.InnControl.setValue(this.Issue2Group.controls.InnControl.value);

		this.Issue2Group.controls.InnControl.markAsTouched();
		this.Issue2Group.controls.BikControl.markAsTouched();
		this.Issue2Group.controls.AccountControl.markAsTouched();

		return this.Issue2Group.controls.InnControl.valid &&
			this.Issue2Group.controls.BikControl.valid &&
			this.Issue2Group.controls.AccountControl.valid;
	}

	public SelectInn(inn: InputAutocompleteComponent) {
		this.InnCompany = "";
		if (!inn.isOpened) {
			return;
		}
		if (inn.selectedOption?.inn) {
			this.Issue2Group.controls.InnControl.setValue(inn.selectedOption.inn);
			this.InnCompany = inn.selectedOption.shortName;

			this.LocInstance.ReciverInn = inn.selectedOption.inn;
			this.LocInstance.ReciverName = inn.selectedOption.shortName;

			if (this.PartnerList.length > 0) {
				let partner: Partner = this.PartnerList.find(e => e.inn == this.LocInstance.ReciverInn);
				if (null != partner && partner.banks && partner.banks.length > 0) {
					this.Issue2Group.controls.BikControl.setValue(partner.banks[0].bik);
					this.Issue2Group.controls.AccountControl.setValue(partner.banks[0].acc);
				}
			}
		}
	}

	public SearchInnAsync() {
		let inn = this.Issue2Group.controls.InnControl.value.trim();
		if (inn === this.CurrentSearchInn) {
			return;
		}

		this.CurrentSearchInn = inn;

		if (inn.length < 5) {
			return;
		}

		this.FoundInnList = [];
		this.AccountServiceInstance.SearchClientByInn(inn).pipe(
			tap(foundInnList => {
				foundInnList.forEach(foundInn => {
					foundInn.innFound = foundInn.inn.substring(0, inn.length);
					foundInn.innTail = foundInn.inn.substring(inn.length);
					this.FoundInnList.push(foundInn);
				});
			}),
			untilComponentDestroyed(this),
		).subscribe();
	}

	private SearchBankAsync() {
		this.Issue2Group.controls.BikControl.setErrors(null);

		const bik = this.Issue2Group.controls.BikControl.value;
		this.AccountServiceInstance.SearchBankByBik(bik).pipe(
			tap(bank => {
				if (null === bank) {
					this.Issue2Group.controls.BikControl.setErrors({"incorrect": "Банк не определен. Проверьте БИК"});
					this.Issue2Group.controls.BikControl.markAsTouched();
					this.LocInstance.ReciverBankName = "";
					return;
				}
		
				this.LocInstance.ReciverBankName = bank.fullName;
				this.LocInstance.ReciverBankBik = bik;
			}),
			untilComponentDestroyed(this),
		).subscribe();
		
	}
}
