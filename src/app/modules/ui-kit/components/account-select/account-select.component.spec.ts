import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AccountSelectComponent } from './account-select.component';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { ClientAccount } from 'src/app/modules/issue/interfaces/client-account.interface';
import { ClickOutsideModule } from '@psb/angular-tools';
import { clickHeader, clickOutside, getItemsWrapper } from './testing';

enum AccountSelectFormField {
    Account = "account"
}

@Component({
    template: `
    <form [formGroup]="formGroup">
      <loc-account-select
        [formControlName]="AccountSelectFormField.Account"
        [accounts]="accounts"
      ></loc-account-select>
    </form>
    <div id="outside">outside</div>
  `,
})
class WrapperComponent {
    accounts: ClientAccount[];
    AccountSelectFormField = AccountSelectFormField;
    formGroup: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
    ) {
        this.createForm();
    }

    createForm(): void {
        this.formGroup = this.formBuilder.group({
            account: [],
        });
    }
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

    it('При инициализации аккаунтов в родительском компоненте также задает их в элементе формы', () => {
        wrapperComponent.accounts = accounts;
        wrapperFixture.detectChanges();

        expect(component.accounts.length).toEqual(accounts.length);
    });

    it('Отображает то же число аккаунтов при клике на заголовок компонента, что и в предоставленных данных', () => {
        wrapperComponent.accounts = accounts;
        wrapperFixture.detectChanges();

        clickHeader(wrapperFixture);

        const itemsWrapper = getItemsWrapper(wrapperFixture);

        expect(itemsWrapper).toBeTruthy();

        expect(component.accounts.length).toEqual(itemsWrapper.children.length);
    });


    it('Убирает выпадающую панель при клике вне компонента', () => {
        clickHeader(wrapperFixture);

        clickOutside(wrapperFixture);

        const itemsWrapper = getItemsWrapper(wrapperFixture);

        expect(itemsWrapper).toBeFalsy();
    });

    it('Выбирает первый аккауунт и закрывает выпадающую панель при клике на первый option', () => {
        wrapperComponent.accounts = accounts;
        wrapperFixture.detectChanges();

        clickHeader(wrapperFixture);

        let itemsWrapper = getItemsWrapper(wrapperFixture);
        itemsWrapper.children[0].nativeElement.click();
        wrapperFixture.detectChanges();

        expect(wrapperComponent.formGroup.value.account).toEqual(wrapperComponent.accounts[0]);

        itemsWrapper = getItemsWrapper(wrapperFixture);

        expect(itemsWrapper).toBeFalsy();
    });

    it('Во инициализации свойства аккаунтов задает значение форме компонента', () => {
        wrapperComponent.accounts = accounts;
        wrapperFixture.detectChanges();

        wrapperComponent.formGroup.patchValue({
            account: accounts[0],
        });

        expect(wrapperComponent.formGroup.value.account).toEqual(accounts[0]);
    });
});
