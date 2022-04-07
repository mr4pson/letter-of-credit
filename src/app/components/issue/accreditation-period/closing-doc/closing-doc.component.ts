import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'closing-doc',
  templateUrl: 'closing-doc.component.html',
  styleUrls: ['closing-doc.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ClosingDocComponent),
      multi: true,
    },
  ],
})
export class ClosingDocComponent implements ControlValueAccessor {
  @Input() index: number;
  value: any;
  formGroup = new FormGroup({
    Document: new FormControl(),
    Amount: new FormControl(),
    OnlyOriginalDocument: new FormControl(),
    AdditionalRequirements: new FormControl(),
  });

  onChange = (index: number) => {};

  onTouched = () => {};

  writeValue(index: number): void {
    this.onChange(index);
  }

  registerOnChange(fn: (index: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
