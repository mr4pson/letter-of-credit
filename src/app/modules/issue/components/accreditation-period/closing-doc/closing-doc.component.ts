import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosingDocComponent implements ControlValueAccessor {
  @Input() formGroupControl: AbstractControl;
  @Output() delete = new EventEmitter();

  get fromGroup() {
    return this.formGroupControl as FormGroup;
  }

  public handleDelete(): void {
    this.delete.emit();
  }

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
