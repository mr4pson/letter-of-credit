import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { getRequiredFormControlValidator } from '@psb/validations/required/validation';
import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';

@Component({
  selector: 'send-application',
  templateUrl: 'send-application.component.html',
  styleUrls: ['send-application.component.scss'],
})
export class SendApplicationComponent implements OnInit {
  public issue5Group = new FormGroup({
    AgreeWithTerms: new FormControl(true),
    CreateLocTemplate: new FormControl(true),
    ContactPersone: new FormControl('', [
      getRequiredFormControlValidator('Вы забыли написать фамилию, имя и отчество.'),
    ]),
    ContactPhone: new FormControl('', [
      getRequiredFormControlValidator('Укажите контактный телефон ответственного'),
    ]),
  });

  @Input() locInstance: LetterOfCredit;

  ngOnInit(): void {
    if (!this.locInstance) {
      return;
    }

    this.issue5Group.get('ContactPersone')?.valueChanges.subscribe(() => {
      this.locInstance.contactPersone = this.issue5Group.controls.ContactPersone.valid ?
        this.issue5Group.controls.ContactPersone.value : '';
    });

    this.issue5Group.get('ContactPhone')?.valueChanges.subscribe(() => {
      this.locInstance.contactPhone = this.issue5Group.controls.ContactPhone.valid ?
        this.issue5Group.controls.ContactPhone.value : '';
    });

    this.issue5Group.controls.ContactPersone.setValue(this.locInstance.contactPersone);
    this.issue5Group.controls.ContactPhone.setValue(this.locInstance.contactPhone);
  }

  public isValid(): boolean {
    this.issue5Group.controls.ContactPhone.setValue(this.issue5Group.controls.ContactPhone.value);

    this.issue5Group.controls.ContactPersone.markAsTouched();
    this.issue5Group.controls.ContactPhone.markAsTouched();

    return this.issue5Group.controls.ContactPersone.valid && this.issue5Group.controls.ContactPhone.valid;
  }
}
