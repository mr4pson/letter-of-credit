import { Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { getInnFormControlValidator } from "@psb/validations/inn";
import { CounterpartyFormField } from "../../enums/counterparty-form-field.enum";
import { getAccountValidator } from "../../validators";
import {
    INVALID_RECEIVER_ACCOUNT_CONTROL_MESSAGE,
    SET_INN_CONTROL_MESSAGE,
    SET_INN_VALID_LENGTH_CONTROL_MESSAGE,
    SET_RECEIVER_ACCOUNT_CONTROL_MESSAGE,
    SET_RECEIVER_BIK_CONTROL_MESSAGE
} from "./constants";

@Injectable()
export class CounterpartyFormService {
    form: FormGroup;

    public get innControl(): AbstractControl {
        return this.form.get(CounterpartyFormField.Inn);
    }
    public get bikControl(): AbstractControl {
        return this.form.get(CounterpartyFormField.Bik);
    }
    public get accountControl(): AbstractControl {
        return this.form.get(CounterpartyFormField.Account);
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm(): FormGroup {
        this.form = this.formBuilder.group({
            [CounterpartyFormField.Inn]: ['', [
                getRequiredFormControlValidator(SET_INN_CONTROL_MESSAGE),
                getInnFormControlValidator({
                    lengthMessage: SET_INN_VALID_LENGTH_CONTROL_MESSAGE,
                    preventForeignINN: true,
                    allowZero: false,
                    allowKIO: false,
                }),
            ]
            ],
            [CounterpartyFormField.Bik]: ['', [
                getRequiredFormControlValidator(SET_RECEIVER_BIK_CONTROL_MESSAGE),
            ]
            ],
            [CounterpartyFormField.Account]: ['', [
                getRequiredFormControlValidator(SET_RECEIVER_ACCOUNT_CONTROL_MESSAGE),
                getAccountValidator(INVALID_RECEIVER_ACCOUNT_CONTROL_MESSAGE),
            ]
            ],
        });

        return this.form;
    }
}