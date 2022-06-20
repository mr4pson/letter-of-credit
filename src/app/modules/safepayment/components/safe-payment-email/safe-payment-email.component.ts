import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { SET_EMAIL_CONTROL_MESSAGE, SET_VALID_EMAIL_CONTROL_MESSAGE } from './constants';

import { ButtonSize, ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { getEmailFormControlValidator } from '@psb/validations/email';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'safe-payment-email',
  templateUrl: 'safe-payment-email.component.html',
  styleUrls: ['safe-payment-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafePaymentEmailComponent {
  @Output() takeValidEmail = new EventEmitter<string>();

  ButtonType = ButtonType;
  ButtonSize = ButtonSize;
  emailFormControl = new FormControl(this.store.clientEmail, [
    getRequiredFormControlValidator(SET_EMAIL_CONTROL_MESSAGE),
    getEmailFormControlValidator(SET_VALID_EMAIL_CONTROL_MESSAGE),
  ]);

  constructor(private store: StoreService) { }

  takeEmail(): void {
    this.emailFormControl.markAllAsTouched();

    if (!this.emailFormControl.valid) {
      return;
    }

    this.takeValidEmail.emit(this.emailFormControl.value.toString().trim());
  }
}
