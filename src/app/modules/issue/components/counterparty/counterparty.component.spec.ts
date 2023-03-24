import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';

import { StepService } from '../../services/step.service';
import { СounterpartyComponent } from './counterparty.component';
import { PartnersService } from '../../services/partners.service';
import { CounterpartyFormService } from './counterparty-form.service';
import { Page, paths } from '../../constants/routes';
import { clickSubmitButton } from './testing.utils';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { UiKitModule } from 'src/app/modules/ui-kit/ui-kit.module';
import { AccountService, ErrorHandlerService, StoreService } from 'src/app/services';
import { isFormValid } from 'src/app/utils';
import { CounterpartyFormField } from '../../enums/counterparty-form-field.enum';

describe('CounterpartyComponent', () => {
    let component: СounterpartyComponent;
    let fixture: ComponentFixture<СounterpartyComponent>;
    let router: Router;

    const clients$$ = new BehaviorSubject([]);
    const partners$$ = new BehaviorSubject([]);

    const initialForm = {
        inn: '000000000000',
        bik: '000000000',
        account: '00000000000000000000',
    };

    const client = {
        fullName: 'test fullName',
        inn: '000000000002',
        kpp: 'test kpp',
        shortName: 'test shortName',
        innFound: 'test innFound',
        innTail: 'test innTail',
    };

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
                CounterpartyFormService,
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
                        showErrorMessage: () => { },
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

    it('При patchValue форма принимает аналогичное значение заданному', () => {
        component.form.patchValue(initialForm);

        expect(initialForm).toEqual(component.form.value);
    });

    it('Задает значение формы при инициализации партнера и клиента', () => {
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

        component.selectClient(client);
        fixture.detectChanges();

        expect(component.form.value).toEqual({
            inn: client.inn,
            bik: partner.banks[0].bik,
            account: partner.banks[0].acc,
        });

        expect(component.clientCompanyName).toEqual(client.shortName);
    });

    it('При изменении ИНН получает список клиентов', (done: DoneFn) => {
        component.clients$.subscribe((clients) => {
            if (clients.length === 0) {
                return;
            }

            expect(clients.length).toEqual(clients$$.getValue().length);
            done();
        });

        component.form.get(CounterpartyFormField.Inn).patchValue('000000000003');

        clients$$.next([client]);
    });

    it('Вызывает handleSubmit при сабмите формы', () => {
        spyOn(component, 'handleSubmit');
        clickSubmitButton(fixture);

        expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('Редиректит к маршруту counterparty contract при валидной форме', () => {
        component.form.patchValue(initialForm);

        spyOn(router, 'navigateByUrl');
        clickSubmitButton(fixture);

        expect(isFormValid(component.form)).toBeTruthy();
        expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.COUNTERPARTY_CONTRACT]);
    });
});
