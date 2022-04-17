import { Component } from '@angular/core';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { StoreService } from 'src/app/models/state.service';

@Component({
  selector: 'issue-success',
  templateUrl: 'issue-success.component.html',
  styleUrls: ['issue-success.component.scss'],
})
export class IssueSuccessComponent {
  public ButtonType = ButtonType;

  constructor(private store: StoreService) { }

  public dialogClose(): void {
    this.store.closeSuccessDialog();
  }
}
