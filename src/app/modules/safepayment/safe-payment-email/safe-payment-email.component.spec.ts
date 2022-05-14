import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SafePaymentEmailComponent } from './safe-payment-email.component';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { StoreService } from 'src/app/services';

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
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePaymentEmailComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call takeEmail on button click', () => {
    spyOn(component, 'takeEmail');
    const btn = fixture.debugElement.query(By.css('.email-form__button'));
    btn.nativeElement.click();

    expect(component.takeEmail).toHaveBeenCalled();
  });

  it('should emit value on click if email valid', () => {
    const testEmail = 'test@mail.ru';
    component.emailFormControl.patchValue('test@mail.ru');

    spyOn(component.takeValidEmail, 'emit');
    const btn = fixture.debugElement.query(By.css('.email-form__button'));
    btn.nativeElement.click();

    expect(component.takeValidEmail.emit).toHaveBeenCalledWith(testEmail);
  });
});
