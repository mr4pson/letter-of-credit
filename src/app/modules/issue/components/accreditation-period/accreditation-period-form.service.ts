import { Injectable } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from "src/app/utils";
import { AccreditationPeriodFormField } from "../../enums/accreditation-period-form-field.enum";
import { ClosingDoc } from "../../interfaces/closing-doc.interface";
import { END_LOC_DATE_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class AccreditationPeriodFormService {
    form: FormGroup;

    get endLocDateControl() {
        return this.form.controls[AccreditationPeriodFormField.EndLocDate];
    }

    get locDaysNumberControl() {
        return this.form.controls[AccreditationPeriodFormField.LocDaysNumber];
    }

    get isDocumentDigitalControl() {
        return this.form.controls[AccreditationPeriodFormField.IsDocumentDigital];
    }

    get allowUsePartOfLocControl() {
        return this.form.controls[AccreditationPeriodFormField.AllowUsePartOfLoc];
    }

    get closingDocsControl() {
        return this.form.controls[AccreditationPeriodFormField.ClosingDocs] as FormArray;
    }

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
    } = {} as ClosingDoc): void {
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

    removeClosingDoc(index: number): void {
        this.closingDocsControl.controls.splice(index, 1);
    }

    setLocDate(days: number, currentDate: Date): void {
        const summedDate = getSummedDateDays(currentDate, Number(days));

        this.endLocDateControl.setValue(summedDate);
    }

    setLocDays(currentDate: Date): void {
        const locDays = this.endLocDateControl.valid
            ? getSubstractDatesDays(this.endLocDateControl.value, currentDate)
            : '';

        if (Number(this.locDaysNumberControl.value) !== locDays && locDays > 0) {
            this.locDaysNumberControl.setValue(
                locDays.toString(),
            );
        }
    }
}