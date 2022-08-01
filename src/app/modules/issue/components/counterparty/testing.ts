import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { СounterpartyComponent } from "./counterparty.component";


export const clickSubmitButton = (fixture: ComponentFixture<СounterpartyComponent>) => {
    const submitButton = fixture.debugElement.query(By.css('.counterparty .submit button'));
    submitButton.nativeElement.click();
    fixture.detectChanges();
}
