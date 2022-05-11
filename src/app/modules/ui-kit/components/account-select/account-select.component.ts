import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CustomControlAccessorDirective } from '../../directives/custom-control-accessor.directive';

import { ClientAccount } from 'src/app/modules/issue/interfaces/client-account.interface';

@Component({
  selector: 'loc-account-select',
  templateUrl: 'account-select.component.html',
  styleUrls: ['account-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSelectComponent extends CustomControlAccessorDirective implements ControlValueAccessor {
  @Input() public accounts: ClientAccount[] = [];
  @Input() public isAccountCodeVisible = false;
  @Input() public placeholderHidden = false;
  @Input() public description = '';

  @Output() accountSelect = new EventEmitter<ClientAccount>();

  public selectedAccount$$ = new BehaviorSubject<ClientAccount>(null);
  public selectedAccount$ = this.selectedAccount$$.asObservable();
  get selectedAccount() {
    return this.selectedAccount$$.getValue();
  }
  set selectedAccount(value) {
    this.selectedAccount$$.next(value);
  }

  private dropped$$ = new BehaviorSubject(false);
  public dropped$ = this.dropped$$.asObservable();
  get dropped() {
    return this.dropped$$.getValue();
  }
  set dropped(value) {
    this.dropped$$.next(value);
  }

  get error() {
    return this.formControl.touched
      && this.formControl.errors
      && Object.values(this.formControl.errors)[0];
  }

  public handleHeaderClick(): void {
    this.dropped = !this.dropped;
  }

  public handleClickOutside(): void {
    this.dropped = false;
  }

  public handleSelectAccount(account: ClientAccount): void {
    this.dropped = false;
    this.selectedAccount = account;

    this.formControl.setValue(this.selectedAccount);
    this.accountSelect.emit(account);
  }

  private initSelectedOption(initAccount: ClientAccount) {
    if (initAccount && this.accounts.length) {
      this.selectedAccount = this.accounts.find(account => (
        account.accountCode === initAccount.accountCode
      )) ?? null;
      this.cdr.markForCheck();
    }
  }

  writeValue(initAccount: ClientAccount) {
    this.initSelectedOption(initAccount);
  }
}
