import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { tap } from 'rxjs/operators';

import { LetterOfCredit } from './interfaces/letter-of-credit.interface';
import { DEFAULT_LOC_INSTANCE } from './constants/constants';
import { Page, paths } from './constants/routes';
import { StepService } from './services/step.service';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { PsbDomHelper } from 'src/app/classes/psb-dom.helper';
import { StoreService } from 'src/app/models/state.service';

@Component({
  selector: 'loc-issue',
  templateUrl: 'issue.component.html',
  styleUrls: ['issue.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IssueComponent extends OnDestroyMixin implements OnInit {
  public allowIssue = false;
  public ButtonType = ButtonType;
  public locInstance = {} as LetterOfCredit;
  public steps = this.stepService.steps;
  public currentUrl: string;

  constructor(
    private store: StoreService,
    private router: Router,
    private stepService: StepService,
  ) {
    super();
  }

  ngOnInit(): void {
    const observer = new MutationObserver(() => {
      const newPaymentButton = PsbDomHelper.getNewPaymentButtonElement();
      if (!newPaymentButton) {
        return;
      }

      if (!PsbDomHelper.getNewLocPaymentButtonElement()) {
        this.createNewLocButton(newPaymentButton);
        this.allowIssue = false;
      }
    });

    // observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});

    this.store.setIssueComponent(this);

    this.stepService.currentUrl$.pipe(
      tap((current) => {
        this.currentUrl = current;
      }),
      untilComponentDestroyed(this),
    ).subscribe();
  }

  private createNewLocButton(newPaymentButton: Element): void {
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-default', 'btn-default-left', 'waves-effect', 'new-payment', 'js-new-loc');
    btn.innerText = 'Новый покрытый аккредитив';
    btn.style.cssText = 'position: absolute;top: 51px;right: 0;';

    btn.addEventListener('click', () => {
      this.doOpenIssue();
    });

    newPaymentButton.after(btn);
  }

  public navigateBack(): void {
    if (this.currentUrl === this.steps[0].url) {
      this.closeIssue();

      return;
    }

    const prevStepUrl = this.stepService.getPrevUrl(this.currentUrl);
    this.router.navigateByUrl(prevStepUrl);
  }

  public doOpenIssue(): void {
    if (this.store.allowIssue) {
      this.locInstance = {
        ...DEFAULT_LOC_INSTANCE,
        ...this.store,
      };
    } else {
      this.store.restoreDefaultState();
    }

    this.router.navigateByUrl(paths[Page.ACCREDITATION_AMOUNT]);

    PsbDomHelper.hideDocuments();
    this.allowIssue = true;
  }

  private closeIssue(): void {
    this.allowIssue = false;
    PsbDomHelper.showDocuments();
  }
}
