import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { getMinMaxFormControlValidator } from '@psb/validations/minMax';
import { getRequiredFormControlValidator } from '@psb/validations/required/validation';
import { FormatHelper } from 'src/app/classes/format-helper';
import { AccountService } from 'src/app/models/account.service';
import { ClientAccountsService } from 'src/app/models/client-accounts.service';
import { StoreService } from 'src/app/models/state.service';

@Component({
  selector: 'accreditation-amount',
  templateUrl: 'accreditation-amount.component.html',
  styleUrls: ['accreditation-amount.component.scss'],
})
export class AccreditationAmountComponent implements OnInit {
  public issue1Group = new FormGroup({
    IssueSum: new FormControl('', {
      validators: [
        getRequiredFormControlValidator('Укажите сумму аккредитива'),
        getMinMaxFormControlValidator({
          min: 1,
          max: 1_000_000_000_000,
          errorMessage: 'Укажите сумму аккредитива',
        }),
      ],
      updateOn: 'blur',
    }),
    SelectedAccount: new FormControl(),
  });
  public commission = 0;
  public formattedCommission = '0,00';
  public accounts: SelectedItem[] = [];

  private commisionRequestStarted = false;
  private commisionsHasDelayedRequest = false;

  constructor(
    private store: StoreService,
    private accountServiceInstance: AccountService,
    private clientAccountsServiceInstance: ClientAccountsService,
  ) {}

  ngOnInit(): void {
    if (this.store.paymentSum > 0) {
      this.issue1Group.controls.IssueSum.setValue(this.store.paymentSum);
    }

    this.fillAccountsAsync();

    this.issue1Group.get('IssueSum')?.valueChanges.subscribe(() => {
      this.fetchCommissionAsync();
    });

    if (this.issue1Group.get('IssueSum').value > 0) {
      this.fetchCommissionAsync();
    }
  }

  public isValid(): boolean {
    this.issue1Group.controls.IssueSum.setValue(
      this.issue1Group.controls.IssueSum.value.toString(),
    );
    this.issue1Group.controls.IssueSum.markAsTouched();

    return this.issue1Group.controls.IssueSum.valid;
  }

  public get IssueSum(): number {
    return this.issue1Group.controls.IssueSum.value;
  }

  public async fetchCommissionAsync() {
    if (!this.issue1Group.controls.IssueSum.valid) {
      this.commission = 0;
      this.formattedCommission = FormatHelper.getSumFormatted(
        this.commission,
      );
      return;
    }
    if (this.commisionRequestStarted) {
      this.commisionsHasDelayedRequest = true;
      return;
    }
    this.commisionRequestStarted = true;
    const sum = this.issue1Group.controls.IssueSum.value as number;
    const result: number = await this.accountServiceInstance.getCommision(sum).toPromise();
    if (null !== this.accountServiceInstance.lastError) {
      alert('Ошибка при получении размера коммисии.');
    }
    this.commission = result;
    this.formattedCommission = FormatHelper.getSumFormatted(
      this.commission,
    );
    this.commisionRequestStarted = false;

    if (
      this.commisionsHasDelayedRequest &&
      sum !== (this.issue1Group.controls.IssueSum.value as number)
    ) {
      this.fetchCommissionAsync();
    }
    this.commisionsHasDelayedRequest = false;
  }

  private async fillAccountsAsync() {
    const list =
      await this.clientAccountsServiceInstance.fetchAccountsAsync();
    // tslint:disable-next-line: forin
    for (const index in list) {
      const instance: SelectedItem = {
        id: list[index].accountCode,
        label: list[index].title,
        value: list[index],
      };

      this.accounts.push(instance);
    }

    if (this.accounts.length > 0) {
      this.issue1Group.controls.SelectedAccount.setValue(
        this.accounts[0].label,
      );
    }
  }

  public get accountSum(): string {
    return this.accounts.find(
      e => e.label === this.issue1Group.controls.SelectedAccount.value,
    )?.value.GetFormattedBalance();
  }
}
