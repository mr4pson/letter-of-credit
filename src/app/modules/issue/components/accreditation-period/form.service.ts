import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { getTomorrowDate } from "src/app/utils";
import { AccreditationPeriodFormField } from "../../enums/accreditation-period-form-field.enum";
import { ClosingDoc } from "../../interfaces/closing-doc.interface";
import { END_LOC_DATE_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class FormService {
    form: FormGroup;
    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm() {
        this.form = this.formBuilder.group({
            endLocDate: [
                getTomorrowDate(), [
                    getRequiredFormControlValidator(
                        END_LOC_DATE_CONTROL_MESSAGE,
                    ),
                ]
            ],
            locDaysNumber: [''],
            isDocumentDigital: [true],
            allowUsePartOfLoc: [true],
            closingDocs: this.formBuilder.array([]),
        });

        return this.form;
    }

    addClosingDocControl({
        document,
        amount,
        onlyOriginalDocument,
        additionalRequirements,
    } = {} as ClosingDoc) {
        const closingDoc = {
            document: [document],
            amount: [amount ?? 1],
            onlyOriginalDocument: [
                onlyOriginalDocument !== undefined ? onlyOriginalDocument : true,
            ],
            additionalRequirements: [
                additionalRequirements,
            ],
        };
        const formGroup = this.formBuilder.group(closingDoc);

        (this.form.controls[AccreditationPeriodFormField.ClosingDocs] as FormArray).push(formGroup);
    }
}