import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  public ButtonType = ButtonType;
  public ButtonSize = ButtonSize;

  public emailFormControl = new FormControl(this.store.clientEmail, [
    getRequiredFormControlValidator('Вы забыли написать email.'),
    getEmailFormControlValidator('Вы написали некорректный email.'),
  ]);

  constructor(public store: StoreService) { }

  @Output() takeValidEmail = new EventEmitter<string>();

  public takeEmail(): void {
    this.emailFormControl.markAllAsTouched();

    if (!this.emailFormControl.valid) {
      return;
    }

    this.takeValidEmail.emit(this.emailFormControl.value.toString().trim());
  }
}
