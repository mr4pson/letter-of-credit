import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { getSteps } from '../helpers/issue-step.helper';
import { Page, paths } from '../constants/routes';

import { StoreService } from 'src/app/services/store.service';

@Injectable()
export class StepService {
  public steps = getSteps(this.store);

  public currentUrl$ = this.router.events.pipe(
    filter(event => event instanceof NavigationStart),
    map(({ url }: NavigationStart) => {
      const noSlashUrl = url.substring(1, url.length);
      if (!noSlashUrl) {
        return paths[Page.ACCREDITATION_AMOUNT];
      }

      return noSlashUrl;
    }),
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

  public setStepDescription(url: string, description: string): void {
    const curStep = this.steps.find(step => step.url === url);

    if (curStep) {
      curStep.description = description;
    }
  }
}
