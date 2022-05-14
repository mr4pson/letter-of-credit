import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

import { StepService } from '../../services/step.service';
import { СounterpartyComponent } from './counterparty.component';
import { PartnersService } from '../../services/partners.service';
import { Page, paths } from '../../constants/routes';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { UiKitModule } from 'src/app/modules/ui-kit/ui-kit.module';
import { AccountService, ErrorHandlerService, StoreService } from 'src/app/services';

describe('CounterpartyComponent', () => {
  let component: СounterpartyComponent;
  let fixture: ComponentFixture<СounterpartyComponent>;
  let router: Router;

  const clients$$ = new BehaviorSubject([]);
  const partners$$ = new BehaviorSubject([]);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        СounterpartyComponent,
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
            searchClientByInn: (inn: string) => {
              return clients$$.asObservable();
            },
          },
        },
        {
          provide: PartnersService,
          useValue: {
            getPartners: () => {
              return partners$$.asObservable();
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
    fixture = TestBed.createComponent(СounterpartyComponent);
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
      inn: '000000000000',
      bik: '000000000',
      account: '00000000000000000000',
    };
    component.form.patchValue(initialForm);

    expect(initialForm).toEqual(component.form.value);
  });

  it('should select client and set clientCompanyName', () => {
    const partner = {
      shortName: 'test partner shortName',
      inn: '000000000002',
      banks: [
        {
          id: 1,
          bik: '000000001',
          acc: '00000000000000000001',
        },
      ],
    };

    partners$$.next([partner]);
    const client = {
      fullName: 'test fullName',
      inn: '000000000002',
      kpp: 'test kpp',
      shortName: 'test shortName',
      innFound: 'test innFound',
      innTail: 'test innTail',
    };
    component.selectClient(client);
    fixture.detectChanges();

    expect(component.form.value).toEqual({
      inn: client.inn,
      bik: partner.banks[0].bik,
      account: partner.banks[0].acc,
    });

    expect(component.clientCompanyName).toEqual(client.shortName);
  });

  it('should get clients on inn value change', (done: DoneFn) => {
    component.clients$.subscribe((clients) => {
      if (clients.length === 0) {
        return;
      }

      expect(clients.length).toEqual(clients$$.getValue().length);
      done();
    });

    component.innControl.patchValue('000000000003');
    const client = {
      fullName: 'test fullName',
      inn: '000000000002',
      kpp: 'test kpp',
      shortName: 'test shortName',
      innFound: 'test innFound',
      innTail: 'test innTail',
    };
    clients$$.next([client]);
  });

  it('should call handleSubmit on button click', () => {
    spyOn(component, 'handleSubmit');
    const submitButton = fixture.debugElement.query(By.css('.counterparty__submit button'));
    submitButton.nativeElement.click();

    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('should navigate to counterparty on valid form submit click', () => {
    const initialForm = {
      inn: '000000000000',
      bik: '000000000',
      account: '00000000000000000000',
    };
    component.form.patchValue(initialForm);

    spyOn(router, 'navigateByUrl');
    const submitButton = fixture.debugElement.query(By.css('.counterparty__submit button'));
    submitButton.nativeElement.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.COUNTERPARTY_CONTRACT]);
  });
});
