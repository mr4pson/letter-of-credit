import { FormControl, ValidatorFn } from '@angular/forms';

export const getAccountValidator = (message?: string | undefined): ValidatorFn => (control: FormControl) => {
  const account: string = control.value?.replaceAll(' ', '');
  return account?.length > 0 && account.length !== 20
    ? { error: message }
    : {};
};
