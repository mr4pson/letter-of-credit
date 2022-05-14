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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get agenda item number', () => {
    expect(component.getAgendaItemNumber(0)).toEqual(1);
  });

  it('should return false on checkItemHasDelimiter 0 index', () => {
    expect(component.checkItemHasDelimiter(0)).toBeTruthy();
  });

  it('should return true on checkItemHasDelimiter 3 index', () => {
    expect(component.checkItemHasDelimiter(3)).toBeFalsy();
  });
});
