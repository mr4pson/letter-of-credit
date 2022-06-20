import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ReciverStatus } from "src/app/enums/reciver-status.enum";
import { StoreService } from "src/app/services";
import { SafePaymentComponent } from "./safe-payment.component";

export const clickEmailLink = (fixture: ComponentFixture<SafePaymentComponent>) => {
  const emailLink = fixture.debugElement.query(By.css('.email-link'));
  emailLink.nativeElement.click();
  fixture.detectChanges();
}

export const clickNthPaymentBtn = (fixture: ComponentFixture<SafePaymentComponent>, nth: number) => {
  const paymentBtn = fixture.debugElement.query(By.css(`.actions .payment-btn:nth-child(${nth})`));
  paymentBtn.nativeElement.click();
  fixture.detectChanges();
}

export const setUnreliableReciverStatus = (store: StoreService) => {
  store.reciverStatus = ReciverStatus.Unreliable;
}

export const setPartlyReliableReciverStatus = (store: StoreService) => {
  store.reciverStatus = ReciverStatus.PartlyReliable;
}

export const setReliableReciverStatus = (store: StoreService) => {
  store.reciverStatus = ReciverStatus.Reliable;
}
