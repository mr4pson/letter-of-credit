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
});
