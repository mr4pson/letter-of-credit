import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { SafePaymentComponent } from './safe-payment.component';
import { SafePaymentStateManagerService } from './services/safe-payment-state-manager.service';
import { PsbModule } from '../psb/psb.module';
import { SafePaymentAgendaComponent } from './safe-paymet-agenda/safe-payment-agenda.component';
import { SafePaymentEmailComponent } from './safe-payment-email/safe-payment-email.component';
import { SafePayStates } from './enums/safe-payment.enum';
import { Page, paths } from '../issue/constants/routes';
import { ReliableSign } from './enums/reliable-sign.enum';

import { StoreService } from 'src/app/services';
import { SafePaymentButton } from 'src/app/enums/safe-payment-button.enum';
import { ReciverStatus } from 'src/app/enums/reciver-status.enum';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set email in store and change state to ShowAgenda on takeEmail call', () => {
    const email = 'test@gmail.com';
    component.takeEmail(email);

    expect(store.clientEmail).toEqual(email);
    expect(safePaymentStateManager.state).toEqual(SafePayStates.ShowAgenda);
  });

  it('should call showEmail on showEmail button click', () => {
    spyOn(component, 'showEmail');
    const emailLink = fixture.debugElement.query(By.css('.email-link'));
    emailLink.nativeElement.click();
    fixture.detectChanges();

    expect(component.showEmail).toHaveBeenCalled();
  });

  it('should call dialogRef close on do safe payment button click and navigate to accredit amount', () => {
    spyOn(dialogRef, 'close');
    spyOn(router, 'navigateByUrl');
    const paymentBtn = fixture.debugElement.query(By.css('.actions__payment-btn:nth-child(1)'));
    paymentBtn.nativeElement.click();
    fixture.detectChanges();

    expect(dialogRef.close).toHaveBeenCalledWith(SafePaymentButton.DoPay);
    expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.ACCREDITATION_AMOUNT]);
  });

  it('should call dialogRef close with RefusePay on refuse payment button click', () => {
    spyOn(dialogRef, 'close');
    const paymentBtn = fixture.debugElement.query(By.css('.actions__payment-btn:nth-child(2)'));
    paymentBtn.nativeElement.click();
    fixture.detectChanges();

    expect(dialogRef.close).toHaveBeenCalledWith(SafePaymentButton.RefusePay);
  });

  it('should call dialogRef close with OrdinalPay on ordinal payment button click', () => {
    spyOn(dialogRef, 'close');
    const paymentBtn = fixture.debugElement.query(By.css('.actions__payment-btn:nth-child(3)'));
    paymentBtn.nativeElement.click();
    fixture.detectChanges();

    expect(dialogRef.close).toHaveBeenCalledWith(SafePaymentButton.OrdinalPay);
  });

  it('should return reliableRedText on unreliable reciver status', () => {
    store.reciverStatus = ReciverStatus.Unreliable;

    expect(component.getReliableText()).toEqual(ReliableSign.reliableRedText);
  });

  it('should return reliableYellowText on PartlyReliable reciver status', () => {
    store.reciverStatus = ReciverStatus.PartlyReliable;

    expect(component.getReliableText()).toEqual(ReliableSign.reliableYellowText);
  });

  it('should return reliableGrayText on Reliable reciver status', () => {
    store.reciverStatus = ReciverStatus.Reliable;

    expect(component.getReliableText()).toEqual(ReliableSign.reliableGrayText);
  });

  it('should return reliableRed color on unreliable reciver status', () => {
    store.reciverStatus = ReciverStatus.Unreliable;

    expect(component.getReliableColor()).toEqual(ReliableSign.reliableRed);
  });

  it('should return reliableYellow color on PartlyReliable reciver status', () => {
    store.reciverStatus = ReciverStatus.PartlyReliable;

    expect(component.getReliableColor()).toEqual(ReliableSign.reliableYellow);
  });

  it('should return reliableGray color on Reliable reciver status', () => {
    store.reciverStatus = ReciverStatus.Reliable;

    expect(component.getReliableColor()).toEqual(ReliableSign.reliableGray);
  });
});
