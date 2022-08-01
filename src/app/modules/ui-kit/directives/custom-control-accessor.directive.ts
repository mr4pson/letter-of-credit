import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormControlDirective,
    FormControlName,
    FormGroupDirective,
    NgControl,
    NgModel,
    ValidationErrors,
} from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Directive()
export abstract class CustomControlAccessorDirective implements ControlValueAccessor, OnInit, OnDestroy {
    @Input() formControlName!: FormControlName | string | number | null;
    @Input() id!: string;
    @Input() formControl: FormControl | AbstractControl = new FormControl() as FormControl;
    protected emitEvent = true;
    protected destroyed$$ = new ReplaySubject<boolean>();

    constructor(
        @Self() @Optional() public ngControl: NgControl,
        protected cdr: ChangeDetectorRef,
    ) {
        if (this.ngControl !== null) {
            // Setting the value accessor directly (instead of using the providers) to avoid running into a circular import.
            this.ngControl.valueAccessor = this;
            if (!this.id) {
                this.id = `${this.formControlName}`;
            }
        }
    }

    onTouched = (): void => { };

    writeValue(obj: any): void { }

    registerOnChange(fn: (_: any) => void): void { }

    ngOnInit(): void {
        if (this.ngControl instanceof FormControlName) {
            const formGroupDirective = this.ngControl.formDirective as FormGroupDirective;
            if (formGroupDirective) {
                this.formControl = formGroupDirective.form.controls[this.ngControl.name] as FormControl;
            }
        } else if (this.ngControl instanceof FormControlDirective) {
            this.formControl = this.ngControl.control;
        } else if (this.ngControl instanceof NgModel) {
            this.formControl = this.ngControl.control;
            this.formControl.valueChanges.pipe(
                tap(x => this.ngControl.viewToModelUpdate(this.formControl.value)),
                takeUntil(this.destroyed$$),
            ).subscribe();
        } else if (!this.ngControl) {
            this.formControl = new FormControl();
        }

        this.formControl.statusChanges.pipe(
            tap(() => {
                this.cdr.markForCheck();
            }),
            takeUntil(this.destroyed$$),
        ).subscribe();
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        isDisabled ? this.formControl.disable() : this.formControl.enable();
    }

    focus(): void {
        if (this.onTouched) {
            this.onTouched();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$$.next(true);
        this.destroyed$$.complete();
    }

    validate(c: AbstractControl): ValidationErrors | null {
        return this.formControl.valid ? null : {
            invalidForm:
                { valid: false, error: 'this.errorMessage' },
        };
    }
}
