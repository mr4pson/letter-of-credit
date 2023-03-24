import { Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";

import { NDS_LIST } from "../../constants/constants";
import { CounterpartyContractFormField } from "../../enums/counterparty-contract-form-field.enum";
import { SET_AGREEMENT_NUMBER_CONTROL_MESSAGE, SET_AGREEMEN_SUBJECT_CONTROL_MESSAGE, SET_DATE_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class CounterpartyContractFormService {
    form: FormGroup;

    get contractDateControl(): AbstractControl {
        return this.form.get(CounterpartyContractFormField.ContractDate)
    }

    get selectedNdsControl(): AbstractControl {
        return this.form.get(CounterpartyContractFormField.SelectedNds)
    }

    get contractControl(): AbstractControl {
        return this.form.get(CounterpartyContractFormField.Contract)
    }

    get contractInfoControl(): AbstractControl {
        return this.form.get(CounterpartyContractFormField.ContractInfo)
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm(): FormGroup {
        this.form = this.formBuilder.group({
            [CounterpartyContractFormField.ContractDate]: ['', [
                getRequiredFormControlValidator(SET_DATE_CONTROL_MESSAGE),
            ]
            ],
            [CounterpartyContractFormField.SelectedNds]: [NDS_LIST[2].label],
            [CounterpartyContractFormField.Contract]: ['', [
                getRequiredFormControlValidator(SET_AGREEMENT_NUMBER_CONTROL_MESSAGE),
            ]
            ],
            [CounterpartyContractFormField.ContractInfo]: ['', [
                getRequiredFormControlValidator(SET_AGREEMEN_SUBJECT_CONTROL_MESSAGE),
            ]
            ],
        });

        return this.form;
    }
}