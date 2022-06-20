import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { SafePaymentComponent } from './safe-payment.component';
import { SafePaymentStateManagerService } from './services/safe-payment-state-manager.service';
import { PsbModule } from '../psb/psb.module';
import { SafePaymentAgendaComponent } from './components/safe-paymet-agenda/safe-payment-agenda.component';
import { SafePaymentEmailComponent } from './components/safe-payment-email/safe-payment-email.component';
import { SafePayStates } from './enums/safe-payment.enum';
import { Page, paths } from '../issue/constants/routes';
import { ReliableSign } from './enums/reliable-sign.enum';

import { StoreService } from 'src/app/services';
import { SafePaymentButton } from 'src/app/enums/safe-payment-button.enum';
import { ReciverStatus } from 'src/app/enums/reciver-status.enum';
import { clickEmailLink, clickNthPaymentBtn, setPartlyReliableReciverStatus, setReliableReciverStatus, setUnreliableReciverStatus } from './testing';

describe('SafePaymentComponent', () => {
  let component: SafePaymentComponent;
  let fixture: ComponentFixture<SafePaymentComponent>;
  let store: StoreService;
  let safePaymentStateManager: SafePaymentStateManagerService;
  let dialogRef: MatDialogRef<any>;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SafePaymentComponent,
        SafePaymentAgendaComponent,
        SafePaymentEmailComponent,
      ],
      imports: [
        CommonModule,
        PsbModule,
        RouterTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        StoreService,
        SafePaymentStateManagerService,
        {
          provide: MatDialogRef,
          useValue: {
            close: (value) => {},
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePaymentComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(StoreService);
    safePaymentStateManager = TestBed.inject(SafePaymentStateManagerService);
    dialogRef = TestBed.inject(MatDialogRef);
    router = TestBed.inject(Router);
    store.reciverStatus = ReciverStatus.Unknown;

    fixture.detectChanges();
  });

  it('При вызове takeEmail задает email в store и меняет статус на ShowAgenda', () => {
    const email = 'test@gmail.com';
    component.takeEmail(email);

    expect(store.clientEmail).toEqual(email);
    expect(safePaymentStateManager.state).toEqual(SafePayStates.ShowAgenda);
  });

  it('При клике на кнопку "Показать email" вызывает showEmail', () => {
    spyOn(component, 'showEmail');
    clickEmailLink(fixture);

    expect(component.showEmail).toHaveBeenCalled();
  });

  it('Закрывает диалоговое окно при клике на кнопку "Совершить безопасный платёж" c параметром DoPay и редиректит к accredit amount', () => {
    spyOn(dialogRef, 'close');
    spyOn(router, 'navigateByUrl');
    clickNthPaymentBtn(fixture, 1);

    expect(dialogRef.close).toHaveBeenCalledWith(SafePaymentButton.DoPay);
    expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.ACCREDITATION_AMOUNT]);
  });

  it('Закрывает диалоговое окно при клике на кнопку "Отказаться от платежа" c параметром RefusePay', () => {
    spyOn(dialogRef, 'close');
    clickNthPaymentBtn(fixture, 2);

    expect(dialogRef.close).toHaveBeenCalledWith(SafePaymentButton.RefusePay);
  });

  it('Закрывает диалоговое окно при клике на кнопку "Отправить обычный платёж" c параметром OrdinalPay', () => {
    spyOn(dialogRef, 'close');
    clickNthPaymentBtn(fixture, 3);

    expect(dialogRef.close).toHaveBeenCalledWith(SafePaymentButton.OrdinalPay);
  });

  it('Возвращает reliableRedText при unreliable статусе отправителя', () => {
    setUnreliableReciverStatus(store);

    expect(component.getReliableText()).toEqual(ReliableSign.reliableRedText);
  });

  it('Возвращает reliableYellowText при PartlyReliable статусе отправителя', () => {
    setPartlyReliableReciverStatus(store);

    expect(component.getReliableText()).toEqual(ReliableSign.reliableYellowText);
  });

  it('Возвращает reliableGrayText при Reliable статусе отправителя', () => {
    setReliableReciverStatus(store);

    expect(component.getReliableText()).toEqual(ReliableSign.reliableGrayText);
  });

  it('Возвращает reliableRed color при unreliable статусе отправителя', () => {
    setUnreliableReciverStatus(store);

    expect(component.getReliableColor()).toEqual(ReliableSign.reliableRed);
  });

  it('Возвращает reliableYellow color при PartlyReliable статусе отправителя', () => {
    setPartlyReliableReciverStatus(store);

    expect(component.getReliableColor()).toEqual(ReliableSign.reliableYellow);
  });

  it('Возвращает reliableGray color при Reliable статусе отправителя', () => {
    setReliableReciverStatus(store);

    expect(component.getReliableColor()).toEqual(ReliableSign.reliableGray);
  });
});
