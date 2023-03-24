import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SafePaymentFormField } from "./enums/safe-payment-form-field.enum";

@Injectable()
export class SafePaymentFormService {
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm(): FormGroup {
        this.form = this.formBuilder.group({
            [SafePaymentFormField.DontWantSafePayment]: [false],
        });

        return this.form;
    }
}