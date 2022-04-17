import { FormControl, ValidatorFn } from '@angular/forms';

export const getInnSizeValidator = (message?: string | undefined): ValidatorFn => (control: FormControl) => (
  control.value?.length > 0 && control.value.length !== 10 && control.value.length !== 12
    ? { error: message }
    : {}
);
