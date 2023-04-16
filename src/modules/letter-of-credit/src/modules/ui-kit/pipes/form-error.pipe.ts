import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Pipe({
    name: 'formError',
    pure: false,
})
export class FormErrorPipe implements PipeTransform {
    transform(formControl: FormControl | AbstractControl): string {
        return formControl.touched
            && formControl.errors
            && Object.values(formControl.errors)[0];
    }
}
