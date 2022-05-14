import { FormControl, FormGroup, Validators } from '@angular/forms';

import { isFormValid } from './is-form-valid.utils';

describe('isFormValid', () => {
  it('should return false', () => {
    const formGroup = new FormGroup({
      test: new FormControl(null, [Validators.required]),
    });

    expect(isFormValid(formGroup)).toBeFalsy();
  });

  it('should return true', () => {
    const formGroup = new FormGroup({
      test: new FormControl(null, [Validators.required]),
    });

    formGroup.patchValue({ test: 'test' });

    expect(isFormValid(formGroup)).toBeTruthy();
  });
});
