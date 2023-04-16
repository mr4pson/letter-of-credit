import { Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { SendApplicationFormField } from "../../enums/send-application-form-field.enum";
import { SET_PHONE_NUMBER_CONTROL_MESSAGE, SET_USER_INFO_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class SendApplicationFormService {
    form: FormGroup;

    get contactPerson(): AbstractControl {
        return this.form.get(SendApplicationFormField.ContactPerson)
    }

    get contactPhone(): AbstractControl {
        return this.form.get(SendApplicationFormField.ContactPhone)
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm(): FormGroup {
        this.form = this.formBuilder.group({
            [SendApplicationFormField.AgreeWithTerms]: [true],
            [SendApplicationFormField.CreateLocTemplate]: [true],
            [SendApplicationFormField.ContactPerson]: ['', [
                getRequiredFormControlValidator(SET_USER_INFO_CONTROL_MESSAGE),
            ]
            ],
            [SendApplicationFormField.ContactPhone]: ['', [
                getRequiredFormControlValidator(SET_PHONE_NUMBER_CONTROL_MESSAGE),
            ]
            ],
        });

        return this.form;
    }
}