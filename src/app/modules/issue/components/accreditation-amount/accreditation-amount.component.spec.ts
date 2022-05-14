import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import '@angular/common/locales/global/ru';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

import { StepService } from '../../services/step.service';
import { AccreditationAmountComponent } from './accreditation-amount.component';
import { ClientAccountService } from '../../services/client-accounts.service';
import { Page, paths } from '../../constants/routes';

import { AccountService, ErrorHandlerService, StoreService } from 'src/app/services';
import { PsbModule } from 'src/app/modules/psb/psb.module';
import { UiKitModule } from 'src/app/modules/ui-kit/ui-kit.module';

describe('AccreditationAmountComponent', () => {
  let component: AccreditationAmountComponent;
  let fixture: ComponentFixture<AccreditationAmountComponent>;
  let router: Router;
  const accounts = [
    {
      title: 'Расчетный',
      balance: 0,
      accountCode: '0000 0000 0000 0000',
    },
  ];

  const commission$$ = new BehaviorSubject(0);
  const accounts$$ = new BehaviorSubject([]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccreditationAmountComponent,
      ],
      imports: [
        CommonModule,
        PsbModule,
        ReactiveFormsModule,
        RouterTestingModule,
        UiKitModule,
      ],
      providers: [
        StoreService,
        StepService,
        {
          provide: AccountService,
          useValue: {
            getCommision: (issueSum: number) => {
              return commission$$.asObservable();
            },
          },
        },
        {
          provide: ClientAccountService,
          useValue: {
            getClientAccounts: () => {
              return accounts$$.asObservable();
            },
          },
        },
        {
          provide: ErrorHandlerService,
          useValue: {
            showErrorMessage: () => {},
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccreditationAmountComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    component.form.reset();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial form value', () => {
    const initialForm = {
      issueSum: '100',
      selectedAccount: accounts[0],
    };
    component.form.patchValue(initialForm);

    expect(initialForm).toEqual(component.form.value);
  });

  it('should get new commission after issueSum value changed', fakeAsync(() => {
    const commissionValue = 10;
    commission$$.next(commissionValue);
    component.form.controls.issueSum.patchValue('100');
    fixture.detectChanges();
    tick();

    expect(component.commission).toEqual(commissionValue);
  }));

  it('should get accounts on initialization and set first acc as value', fakeAsync(() => {
    accounts$$.next(accounts);
    tick();

    expect(component.form.controls.selectedAccount.value).toEqual(accounts[0]);
  }));

  it('should call handleSubmit on button click', () => {
    spyOn(component, 'handleSubmit');
    const submitButton = fixture.debugElement.query(By.css('.accredit-amount__submit button'));
    submitButton.nativeElement.click();

    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('should navigate to counterparty on valid form submit click', () => {
    const initialForm = {
      issueSum: '100',
      selectedAccount: accounts[0],
    };
    component.form.patchValue(initialForm);

    spyOn(router, 'navigateByUrl');
    const submitButton = fixture.debugElement.query(By.css('.accredit-amount__submit button'));
    submitButton.nativeElement.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.COUNTERPARTY]);
  });
});
