import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";

import { NDS_LIST } from "../../constants/constants";
import { SET_AGREEMENT_NUMBER_CONTROL_MESSAGE, SET_AGREEMEN_SUBJECT_CONTROL_MESSAGE, SET_DATE_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class CounterpartyContractFormService {
    form: FormGroup;

    get contractDateControl() {
        return this.form.controls.contractDate;
    }

    get selectedNdsControl() {
        return this.form.controls.selectedNds;
    }

    get contractControl() {
        return this.form.controls.contract;
    }

    get contractInfoControl() {
        return this.form.controls.contractInfo;
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm() {
        this.form = this.formBuilder.group({
            contractDate: ['', [
                getRequiredFormControlValidator(SET_DATE_CONTROL_MESSAGE),
            ]
            ],
            selectedNds: [NDS_LIST[2].label],
            contract: ['', [
                getRequiredFormControlValidator(SET_AGREEMENT_NUMBER_CONTROL_MESSAGE),
            ]
            ],
            contractInfo: ['', [
                getRequiredFormControlValidator(SET_AGREEMEN_SUBJECT_CONTROL_MESSAGE),
            ]
            ],
        });

        return this.form;
    }
}