import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { getMinMaxFormControlValidator } from "@psb/validations/minMax";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { AccreditationAmountFormField } from "../../enums/accreditation-amount-form-field.enum";

import { ACCREDIT_SUM_CONTROL_MESSAGE, SELECT_ACCOUNT_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class AccreditationAmountFormService {
    form: FormGroup;

    get issueSum(): number {
        return Number(this.form.controls[AccreditationAmountFormField.IssueSum].value);
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm() {
        this.form = this.formBuilder.group({
            issueSum: [null, {
                validators: [
                    Validators.required,
                    getRequiredFormControlValidator(ACCREDIT_SUM_CONTROL_MESSAGE),
                    getMinMaxFormControlValidator({
                        min: 1,
                        max: 1_000_000_000_000,
                        errorMessage: ACCREDIT_SUM_CONTROL_MESSAGE,
                    }),
                ],
                updateOn: 'blur',
            }
            ],
            selectedAccount: [null, [
                Validators.required,
                getRequiredFormControlValidator(SELECT_ACCOUNT_CONTROL_MESSAGE)
            ]
            ],
        });

        return this.form;
    }
}
