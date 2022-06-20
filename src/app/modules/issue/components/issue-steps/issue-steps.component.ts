import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Step } from '../../interfaces/step.interface';
import { StepService } from '../../services/step.service';
@Component({
  selector: 'loc-issue-steps',
  templateUrl: 'issue-steps.component.html',
  styleUrls: ['issue-steps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueStepsComponent implements OnInit {
  steps = this.stepService.steps;
  currentUrl$ = this.stepService.currentUrl$;

  constructor(
    private stepService: StepService,
  ) {}

  ngOnInit(): void {}

  isStepActive(step: Step, currentUrl: string): boolean {
    return step.url === currentUrl;
  }

  isStepDone(stepIndex: number, currentUrl: string): boolean {
    const currentStepIndex = this.steps.findIndex(step => step.url === currentUrl);
    return stepIndex < currentStepIndex;
  }

  getCurrentStepNumber(currentUrl: string): number {
    return this.stepService.getCurrentStepNumber(currentUrl);
  }
}
