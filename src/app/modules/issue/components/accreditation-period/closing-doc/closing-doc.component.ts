import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ClosingDocFormField } from '../../../enums/closing-doc-form-field.enum';

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
export class ClosingDocComponent implements ControlValueAccessor, OnInit {
    @Input() formGroupControl: AbstractControl;
    @Output() delete = new EventEmitter();

    ClosingDocFormField = ClosingDocFormField;
    formGroup: FormGroup;

    ngOnInit(): void {
        this.formGroup = this.formGroupControl as FormGroup;
    }

    handleDelete(): void {
        this.delete.emit();
    }

    onChange = (index: number) => { };

    onTouched = () => { };

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
