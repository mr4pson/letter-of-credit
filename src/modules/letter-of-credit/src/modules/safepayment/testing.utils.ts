import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ReceiverStatus } from "../../enums/receiver-status.enum";
import { StoreService } from "../../services";
import { SafePaymentComponent } from "./safe-payment.component";

export const clickEmailLink = (fixture: ComponentFixture<SafePaymentComponent>): void => {
    const emailLink = fixture.debugElement.query(By.css('.email-link'));
    emailLink.nativeElement.click();
    fixture.detectChanges();
}

export const clickNthPaymentBtn = (fixture: ComponentFixture<SafePaymentComponent>, nth: number): void => {
    const paymentBtn = fixture.debugElement.query(By.css(`.actions .payment-btn:nth-child(${nth})`));
    paymentBtn.nativeElement.click();
    fixture.detectChanges();
}

export const setUnreliableReceiverStatus = (store: StoreService): void => {
    store.receiverStatus = ReceiverStatus.Unreliable;
}

export const setPartlyReliableReceiverStatus = (store: StoreService): void => {
    store.receiverStatus = ReceiverStatus.PartlyReliable;
}

export const setReliableReceiverStatus = (store: StoreService): void => {
    store.receiverStatus = ReceiverStatus.Reliable;
}
