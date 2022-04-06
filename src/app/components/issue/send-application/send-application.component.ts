import {Component, Input, OnInit} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {getRequiredFormControlValidator} from "@psb/validations/required/validation";
import {LetterOfCredit} from "src/app/models/letter-of-credit.model";

@Component({
	selector: "send-application",
	templateUrl: "send-application.component.html",
	styleUrls: ["send-application.component.scss"]
})
export class SendApplicationComponent implements OnInit {
	public Issue5Group = new FormGroup({
		AgreeWithTerms: new FormControl(true),
		CreateLocTemplate: new FormControl(true),
		ContactPersone: new FormControl('', [
			getRequiredFormControlValidator("Вы забыли написать фамилию, имя и отчество."),
		]),
		ContactPhone: new FormControl('', [
			getRequiredFormControlValidator("Укажите контактный телефон ответственного"),
		]),
	});

	@Input() LocInstance: LetterOfCredit;

	ngOnInit(): void {
		var that = this;

		if (!that.LocInstance) {
			return;
		}

		this.Issue5Group.get("ContactPersone")?.valueChanges.subscribe(() => {
			that.LocInstance.ContactPersone = that.Issue5Group.controls.ContactPersone.valid ?
				that.Issue5Group.controls.ContactPersone.value : "";
		});

		this.Issue5Group.get("ContactPhone")?.valueChanges.subscribe(() => {
			that.LocInstance.ContactPhone = that.Issue5Group.controls.ContactPhone.valid ?
				that.Issue5Group.controls.ContactPhone.value : "";
		});

		this.Issue5Group.controls.ContactPersone.setValue(this.LocInstance.ContactPersone);
		this.Issue5Group.controls.ContactPhone.setValue(this.LocInstance.ContactPhone);
	}

	public IsValid(): boolean {
		this.Issue5Group.controls.ContactPhone.setValue(this.Issue5Group.controls.ContactPhone.value);

		this.Issue5Group.controls.ContactPersone.markAsTouched();
		this.Issue5Group.controls.ContactPhone.markAsTouched();

		return this.Issue5Group.controls.ContactPersone.valid && this.Issue5Group.controls.ContactPhone.valid;
	}
}
