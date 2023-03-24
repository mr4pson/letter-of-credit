import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SafePaymentEmailComponent } from './safe-payment-email.component';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { StoreService } from 'src/app/services';
import { emailButtonClick } from './testing.utils';
import { SafePaymentService } from '../../services/safe-payment.service';

describe('SafePaymentEmailComponent', () => {
    let component: SafePaymentEmailComponent;
    let fixture: ComponentFixture<SafePaymentEmailComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SafePaymentEmailComponent,
            ],
            imports: [
                CommonModule,
                PsbModule,
                ReactiveFormsModule,
            ],
            providers: [
                StoreService,
                SafePaymentService
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SafePaymentEmailComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('Вызывает takeEmail при клике на кнопку "Получить материалы"', () => {
        spyOn(component, 'takeEmail');
        emailButtonClick(fixture);

        expect(component.takeEmail).toHaveBeenCalled();
    });

    it('Эмитит значение при клике на кнопку  "Получить материалы" в случае, если email валидный', () => {
        const testEmail = 'test@mail.ru';
        component.emailFormControl.patchValue('test@mail.ru');

        spyOn(component.takeValidEmail, 'emit');
        emailButtonClick(fixture);

        expect(component.takeValidEmail.emit).toHaveBeenCalledWith(testEmail);
    });
});
