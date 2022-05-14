import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AccountSelectComponent } from './account-select.component';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { ClientAccount } from 'src/app/modules/issue/interfaces/client-account.interface';
import { ClickOutsideModule } from '@psb/angular-tools';

@Component({
  template: `
    <form [formGroup]="formGroup">
      <loc-account-select
        formControlName="account"
        [accounts]="accounts"
      ></loc-account-select>
    </form>
    <div id="outside">outside</div>
  `,
})
class WrapperComponent {
  accounts: ClientAccount[];
  formGroup = new FormGroup({
    account: new FormControl(),
  });
}

describe('AccountSelectComponent', () => {
  let component: AccountSelectComponent;
  let wrapperComponent: WrapperComponent;
  let wrapperFixture: ComponentFixture<WrapperComponent>;
  const accounts = [
    {
      title: 'Расчетный',
      balance: 0,
      accountCode: '0000 0000 0000 0000',
    },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccountSelectComponent,
        WrapperComponent,
      ],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        PsbModule,
        ClickOutsideModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    wrapperFixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent = wrapperFixture.componentInstance;
    component = wrapperFixture.debugElement.query(By.css('loc-account-select')).componentInstance;

    wrapperFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set accounts from wrapper component', () => {
    wrapperComponent.accounts = accounts;
    wrapperFixture.detectChanges();

    expect(component.accounts.length).toEqual(accounts.length);
  });

  it('should render same accounts number as in data provided after accountSelect click', () => {
    wrapperComponent.accounts = accounts;
    wrapperFixture.detectChanges();

    const header = wrapperFixture.debugElement.query(By.css('.account-select__dropdown-header'));
    header.nativeElement.click();
    wrapperFixture.detectChanges();

    const itemsWrapper = wrapperFixture.debugElement.query(By.css('.dropdown-panel__items'));

    expect(itemsWrapper).toBeTruthy();

    expect(component.accounts.length).toEqual(itemsWrapper.children.length);
  });


  it('should remove dropdown panel after click outside', () => {
    const header = wrapperFixture.debugElement.query(By.css('.account-select__dropdown-header'));
    header.nativeElement.click();
    wrapperFixture.detectChanges();

    const outside = wrapperFixture.debugElement.query(By.css('#outside'));

    outside.nativeElement.click();
    wrapperFixture.detectChanges();

    const itemsWrapper = wrapperFixture.debugElement.query(By.css('.dropdown-panel__items'));

    expect(itemsWrapper).toBeFalsy();
  });

  it('should select first account and close dropdown panel on first option click', () => {
    wrapperComponent.accounts = accounts;
    wrapperFixture.detectChanges();

    const header = wrapperFixture.debugElement.query(By.css('.account-select__dropdown-header'));
    header.nativeElement.click();
    wrapperFixture.detectChanges();

    let itemsWrapper = wrapperFixture.debugElement.query(By.css('.dropdown-panel__items'));
    itemsWrapper.children[0].nativeElement.click();
    wrapperFixture.detectChanges();

    expect(wrapperComponent.formGroup.value.account).toEqual(wrapperComponent.accounts[0]);

    itemsWrapper = wrapperFixture.debugElement.query(By.css('.dropdown-panel__items'));

    expect(itemsWrapper).toBeFalsy();
  });

  it('should set form value', () => {
    wrapperComponent.accounts = accounts;
    wrapperFixture.detectChanges();

    wrapperComponent.formGroup.patchValue({
      account: accounts[0],
    });

    expect(wrapperComponent.formGroup.value.account).toEqual(accounts[0]);
  });
});
