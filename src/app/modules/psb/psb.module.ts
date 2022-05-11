import { NgModule } from '@angular/core';

import { FormatMoneyPipe, SecurePipe } from './pipes';

import {
  BaseModalModule,
  ButtonModule,
  CheckboxModule,
  DatepickerModule,
  DropdownModule,
  FormFieldModule,
  HeadingModule,
  IconModule,
  InputAutocompleteModule,
  InputSelectModule,
  NumberInputModule,
  PhoneInputModule,
  SpinnerIconModule,
  TemplateTypeModule,
  TextInputModule,
  TextModule,
  TooltipModule,
} from '@psb/fe-ui-kit';

@NgModule({
  declarations: [
    FormatMoneyPipe,
    SecurePipe,
  ],
  imports: [
    TooltipModule,
    CheckboxModule,
    ButtonModule,
    TextInputModule,
    TextModule,
    HeadingModule,
    NumberInputModule,
    IconModule,
    FormFieldModule,
    SpinnerIconModule,
    InputSelectModule,
    DropdownModule,
    InputAutocompleteModule,
    TemplateTypeModule,
    DatepickerModule,
    BaseModalModule,
    PhoneInputModule,
  ],
  exports: [
    TooltipModule,
    CheckboxModule,
    ButtonModule,
    TextInputModule,
    TextModule,
    HeadingModule,
    NumberInputModule,
    IconModule,
    FormFieldModule,
    SpinnerIconModule,
    InputSelectModule,
    DropdownModule,
    InputAutocompleteModule,
    TemplateTypeModule,
    DatepickerModule,
    BaseModalModule,
    PhoneInputModule,
    FormatMoneyPipe,
    SecurePipe,
  ],
})
export class PsbModule {}
