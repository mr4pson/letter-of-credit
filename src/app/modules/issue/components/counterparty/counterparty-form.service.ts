import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { getAccountValidator, getInnSizeValidator } from "../../validators";
import {
    INVALID_RECIVER_ACCOUNT_CONTROL_MESSAGE,
    SET_INN_CONTROL_MESSAGE,
    SET_INN_VALID_LENGTH_CONTROL_MESSAGE,
    SET_RECEIVER_ACCOUNT_CONTROL_MESSAGE,
    SET_RECEIVER_BIK_CONTROL_MESSAGE
} from "./constants";

@Injectable()
export class CounterpartyFormService {
    form: FormGroup;

    public get innControl() {
        return this.form.controls.inn;
    }
    public get bikControl() {
        return this.form.controls.bik;
    }
    public get accountControl() {
        return this.form.controls.account;
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm() {
        this.form = this.formBuilder.group({
            inn: ['', [
                getRequiredFormControlValidator(SET_INN_CONTROL_MESSAGE),
                getInnSizeValidator(SET_INN_VALID_LENGTH_CONTROL_MESSAGE),
            ]
            ],
            bik: ['', [
                getRequiredFormControlValidator(SET_RECEIVER_BIK_CONTROL_MESSAGE),
            ]
            ],
            account: ['', [
                getRequiredFormControlValidator(SET_RECEIVER_ACCOUNT_CONTROL_MESSAGE),
                getAccountValidator(INVALID_RECIVER_ACCOUNT_CONTROL_MESSAGE),
            ]
            ],
        });

        return this.form;
    }
}