import { AbstractControl, FormGroup } from '@angular/forms';

const markControl = (control: AbstractControl): void => {
    control.markAsDirty();
    control.markAsTouched();
    control.updateValueAndValidity();
};

export const isFormValid = (formGroup: FormGroup): boolean => {
    return Object.keys(formGroup.controls).reduce((accum: boolean, formControlName): boolean => {
        const control = formGroup.controls[formControlName];

        if (!control.valid) {
            if (control instanceof FormGroup) {
                Object.values(control.controls).forEach((subControl) => {
                    markControl(subControl);
                });
            }

            markControl(control);
        }

        return accum && control.valid;
    }, true);
};
