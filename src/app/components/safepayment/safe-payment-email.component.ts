import {Component, EventEmitter, Output, ViewEncapsulation} from "@angular/core";
import {FormControl} from '@angular/forms';
import {ButtonSize, ButtonType} from "@psb/fe-ui-kit/src/components/button";
import {getRequiredFormControlValidator} from '@psb/validations/required';
import {getEmailFormControlValidator} from '@psb/validations/email';
import {StoreService} from "src/app/models/state.service";

@Component({
	selector: "safe-payment-email",
	templateUrl: "safe-payment-email.component.html",
	styleUrls: ["safe-payment-email.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class SafePaymentEmailComponent {
	public ButtonType = ButtonType;
	public ButtonSize = ButtonSize;

	public EmailFormControl = new FormControl(this.Store.ClientEmail, [
		getRequiredFormControlValidator("Вы забыли написать email."),
		getEmailFormControlValidator("Вы написали некорректный email."),
	]);

	constructor(public Store: StoreService) { }

	@Output() TakeValidEmail = new EventEmitter();

	public TakeEmail(): void {
		this.EmailFormControl.markAllAsTouched();

		if (!this.EmailFormControl.valid) {
			return;
		}

		this.TakeValidEmail.emit(this.EmailFormControl.value.toString().trim());
	}
}
