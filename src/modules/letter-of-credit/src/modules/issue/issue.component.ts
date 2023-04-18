import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

import { StepService } from './services/step.service';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { takeUntilDestroyed, UntilDestroy } from '@psb/angular-tools';
import { NgService, StoreService } from '../../services';

@Component({
    selector: 'loc-issue',
    templateUrl: 'issue.component.html',
    styleUrls: ['issue.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class IssueComponent implements OnInit {
    ButtonType = ButtonType;
    steps = this.stepService.steps;
    currentUrl: string;

    constructor(
        private router: Router,
        private stepService: StepService,
        private ngService: NgService,
        private store: StoreService,
    ) { }

    ngOnInit(): void {
        this.stepService.currentUrl$.pipe(
            tap((currentUrl) => {
                this.currentUrl = currentUrl;
            }),
            takeUntilDestroyed(this),
        ).subscribe();
    }

    navigateBack(): void {
        if (this.currentUrl === this.steps[0].url) {
            this.store.isIssueVissible = false;
            // this.ngService.showSmbDocuments();

            return;
        }

        const prevStepUrl = this.stepService.getPrevUrl(this.currentUrl);
        this.router.navigateByUrl(prevStepUrl);
    }
}
