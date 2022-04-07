import { Component, Input } from '@angular/core';

import { Step } from 'src/app/classes/interfaces/step.interface';
import { StoreService } from 'src/app/models/state.service';

@Component({
  selector: 'loc-issue-steps',
  templateUrl: 'issue-steps.component.html',
  styleUrls: ['issue-steps.component.scss'],
})
export class IssueStepsComponent {
  @Input() public currentStep = 1;

  steps: Step[] = [
    {
      title: 'Сумма аккредитива с комиссией',
      description: this.store.issueStep1Text,
    },
    {
      title: 'Контрагент',
      description: this.store.issueStep2Text,
    },
    {
      title: 'Договор с контрагентом',
      description: this.store.issueStep3Text,
    },
    {
      title: 'Срок действия аккредитива',
      description: this.store.issueStep4Text,
    },
    {
      title: 'Отправить заявку',
    },
  ];

  public constructor(public store: StoreService) {}
}
