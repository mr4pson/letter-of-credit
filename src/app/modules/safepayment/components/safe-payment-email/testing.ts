import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { SafePaymentEmailComponent } from "./safe-payment-email.component";

export const emailButtonClick = (fixture: ComponentFixture<SafePaymentEmailComponent>) => {
  const btn = fixture.debugElement.query(By.css('.email-form .button'));
  btn.nativeElement.click();
}
