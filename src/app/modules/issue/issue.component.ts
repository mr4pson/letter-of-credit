import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { tap } from 'rxjs/operators';

import { StepService } from './services/step.service';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { NgService } from 'src/app/services/ng.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'loc-issue',
  templateUrl: 'issue.component.html',
  styleUrls: ['issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueComponent extends OnDestroyMixin implements OnInit {
  public ButtonType = ButtonType;
  public steps = this.stepService.steps;
  public currentUrl: string;

  constructor(
    private router: Router,
    private stepService: StepService,
    private ngService: NgService,
    private store: StoreService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.stepService.currentUrl$.pipe(
      tap((currentUrl) => {
        this.currentUrl = currentUrl;
      }),
      untilComponentDestroyed(this),
    ).subscribe();
  }

  public navigateBack(): void {
    if (this.currentUrl === this.steps[0].url) {
      this.store.isIssueVissible = false;
      this.ngService.showSmbDocuments();

      return;
    }

    const prevStepUrl = this.stepService.getPrevUrl(this.currentUrl);
    this.router.navigateByUrl(prevStepUrl);
  }
}
