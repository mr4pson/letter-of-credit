import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SafePaymentAgendaComponent } from './safe-payment-agenda.component';

describe('SafePaymentAgendaComponent', () => {
    let component: SafePaymentAgendaComponent;
    let fixture: ComponentFixture<SafePaymentAgendaComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                SafePaymentAgendaComponent,
            ],
            imports: [
                CommonModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SafePaymentAgendaComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('Возвращает 1 при инексе getAgendaItemNumber равным 0', () => {
        expect(component.getAgendaItemNumber(0)).toEqual(1);
    });

    it('Возвращает false при индексе checkItemHasDelimiter равным 0', () => {
        expect(component.checkItemHasDelimiter(0)).toBeTruthy();
    });

    it('Возвращает true при индексе checkItemHasDelimiter равным 3', () => {
        expect(component.checkItemHasDelimiter(3)).toBeFalsy();
    });
});
