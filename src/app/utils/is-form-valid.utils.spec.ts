import { FormControl, FormGroup, Validators } from '@angular/forms';

import { isFormValid } from './is-form-valid.utils';

describe('isFormValid', () => {
  it('Возвращает false при невалидной форме', () => {
    const formGroup = new FormGroup({
      test: new FormControl(null, [Validators.required]),
    });

    expect(isFormValid(formGroup)).toBeFalsy();
  });

  it('Возвращает true при валидной форме', () => {
    const formGroup = new FormGroup({
      test: new FormControl(null, [Validators.required]),
    });

    formGroup.patchValue({ test: 'test' });

    expect(isFormValid(formGroup)).toBeTruthy();
  });
});
