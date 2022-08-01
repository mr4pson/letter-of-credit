import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { SET_PHONE_NUMBER_CONTROL_MESSAGE, SET_USER_INFO_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class SendApplicationFormService {
    form: FormGroup;

    get contactPerson() {
        return this.form.controls.contactPerson;
    }

    get contactPhone() {
        return this.form.controls.contactPhone;
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm() {
        this.form = this.formBuilder.group({
            agreeWithTerms: [true],
            createLocTemplate: [true],
            contactPerson: ['', [
                getRequiredFormControlValidator(SET_USER_INFO_CONTROL_MESSAGE),
            ]
            ],
            contactPhone: ['', [
                getRequiredFormControlValidator(SET_PHONE_NUMBER_CONTROL_MESSAGE),
            ]
            ],
        });

        return this.form;
    }
}