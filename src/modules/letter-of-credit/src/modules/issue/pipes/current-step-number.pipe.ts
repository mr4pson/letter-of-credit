import { Pipe, PipeTransform } from '@angular/core';
import { StepService } from '../services/step.service';

@Pipe({
    name: 'currentStepNumber',
    pure: false,
})
export class CurrentStepNumberPipe implements PipeTransform {
    constructor(
        private stepService: StepService,
    ) { }

    transform(currentUrl: string): number {
        return this.stepService.getCurrentStepNumber(currentUrl);
    }
}
