import { Injectable } from "@angular/core";
import { AbstractControl, FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { getRequiredFormControlValidator } from "@psb/validations/required";
import { getSubstractDatesDays, getSummedDateDays, getTomorrowDate } from "src/app/utils";
import { AccreditationPeriodFormField } from "../../enums/accreditation-period-form-field.enum";
import { ClosingDocFormField } from "../../enums/closing-doc-form-field.enum";
import { ClosingDoc } from "../../interfaces/closing-doc.interface";
import { END_LOC_DATE_CONTROL_MESSAGE } from "./constants";

@Injectable()
export class AccreditationPeriodFormService {
    form: FormGroup;

    get endLocDateControl(): AbstractControl {
        return this.form.get(AccreditationPeriodFormField.EndLocDate);
    }

    get locDaysNumberControl(): AbstractControl {
        return this.form.get(AccreditationPeriodFormField.LocDaysNumber);
    }

    get isDocumentDigitalControl(): AbstractControl {
        return this.form.get(AccreditationPeriodFormField.IsDocumentDigital);
    }

    get allowUsePartOfLocControl(): AbstractControl {
        return this.form.get(AccreditationPeriodFormField.AllowUsePartOfLoc);
    }

    get closingDocsControl(): FormArray {
        return this.form.get(AccreditationPeriodFormField.ClosingDocs) as FormArray;
    }

    constructor(
        private formBuilder: FormBuilder,
    ) { }

    createForm(): FormGroup {
        this.form = this.formBuilder.group({
            [AccreditationPeriodFormField.EndLocDate]: [
                getTomorrowDate(), [
                    getRequiredFormControlValidator(
                        END_LOC_DATE_CONTROL_MESSAGE,
                    ),
                ]
            ],
            [AccreditationPeriodFormField.LocDaysNumber]: [''],
            [AccreditationPeriodFormField.IsDocumentDigital]: [true],
            [AccreditationPeriodFormField.AllowUsePartOfLoc]: [true],
            [AccreditationPeriodFormField.ClosingDocs]: this.formBuilder.array([]),
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
            [ClosingDocFormField.Document]: [document],
            [ClosingDocFormField.Amount]: [amount ?? 1],
            [ClosingDocFormField.OnlyOriginalDocument]: [
                onlyOriginalDocument !== undefined ? onlyOriginalDocument : true,
            ],
            [ClosingDocFormField.AdditionalRequirements]: [
                additionalRequirements,
            ],
        };
        const formGroup = this.formBuilder.group(closingDoc);

        (this.form.get(AccreditationPeriodFormField.ClosingDocs) as FormArray).push(formGroup);
    }

    removeClosingDoc(index: number): void {
        this.closingDocsControl.removeAt(index);
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