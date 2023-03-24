import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AccreditationAmountComponent } from "./accreditation-amount.component";

export const clickSubmitButton = (fixture: ComponentFixture<AccreditationAmountComponent>): void => {
    const submitButton = fixture.debugElement.query(By.css('.accredit-amount .submit button'));
    submitButton.nativeElement.click();
    fixture.detectChanges();
}
