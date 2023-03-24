import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Step } from '../../interfaces/step.interface';
import { StepService } from '../../services/step.service';
@Component({
    selector: 'loc-issue-steps',
    templateUrl: 'issue-steps.component.html',
    styleUrls: ['issue-steps.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueStepsComponent {
    steps = this.stepService.steps;
    currentUrl$: Observable<string>;

    constructor(
        private stepService: StepService,
    ) {
        this.initObservables();
    }

    private initObservables(): void {
        this.currentUrl$ = this.stepService.currentUrl$;
    }

    isStepActive(step: Step, currentUrl: string): boolean {
        return step.url === currentUrl;
    }

    isStepDone(stepIndex: number, currentUrl: string): boolean {
        const currentStepIndex = this.steps.findIndex(step => step.url === currentUrl);
        return stepIndex < currentStepIndex;
    }
}
