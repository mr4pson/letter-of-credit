import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { getSteps } from '../helpers/issue-step.helper';

import { StoreService } from 'src/app/models/state.service';

@Injectable()
export class StepService {
  public steps = getSteps(this.store);

  public currentUrl$ = this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    map(({ url }: NavigationStart) => (url.substring(1, url.length))),
  );

  constructor(
    private store: StoreService,
    private router: Router,
  ) {}

  public getPrevUrl(currentUrl: string): string {
    const currentStepIndex = this.steps.findIndex(step => step.url === currentUrl);
    return this.steps[currentStepIndex - 1].url;
  }

  public getCurrentStepNumber(currentUrl: string): number {
    const currentStepIndex = this.steps.findIndex(step => step.url === currentUrl);
    return currentStepIndex + 1;
  }
}
