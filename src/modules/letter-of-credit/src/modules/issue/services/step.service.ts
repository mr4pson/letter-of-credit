import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { Page, paths } from '../constants/routes';
import { STEPS } from '../constants/constants';
import { Observable } from 'rxjs';

@Injectable()
export class StepService {
    steps = STEPS;
    currentUrl$: Observable<string>;

    constructor(
        private router: Router,
    ) {
        this.initObservables();
    }

    private initObservables(): void {
        this.currentUrl$ = this.router.events.pipe(
            filter(event => event instanceof NavigationStart),
            map(({ url }: NavigationStart) => {
                const noSlashUrl = url.substring(1, url.length);
                if (!noSlashUrl) {
                    return paths[Page.ACCREDITATION_AMOUNT];
                }

                return noSlashUrl;
            }),
        );
    }

    getPrevUrl(currentUrl: string): string {
        const currentStepIndex = this.steps.findIndex(step => step.url === currentUrl);
        return this.steps[currentStepIndex - 1]?.url;
    }

    getCurrentStepNumber(currentUrl: string): number {
        const currentStepIndex = this.steps.findIndex(step => step.url === currentUrl);
        return currentStepIndex + 1;
    }

    setStepDescription(url: string, description: string): void {
        const curStep = this.steps.find(step => step.url === url);

        if (curStep) {
            curStep.description = description;
        }
    }
}
