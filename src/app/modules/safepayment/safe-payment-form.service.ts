import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Injectable()
export class SafePaymentFormService {
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm() {
        this.form = this.formBuilder.group({
            dontWantSafePayment: [false],
        });

        return this.form;
    }
}