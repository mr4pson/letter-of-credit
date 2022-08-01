import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { CounterpartyContractComponent } from "./counterparty-contract.component";

export const clickVatBtn = (fixture: ComponentFixture<CounterpartyContractComponent>) => {
    const vatBtn = fixture.debugElement.query(
        By.css('.counterparty-contract .nds-actions psb-button:first-child button'),
    );
    vatBtn.nativeElement.click();
}

export const clickNoVatBtn = (fixture: ComponentFixture<CounterpartyContractComponent>) => {
    const vatBtn = fixture.debugElement.query(
        By.css('.counterparty-contract .nds-actions psb-button:last-child button'),
    );
    vatBtn.nativeElement.click();
}

export const clickSubmitButton = (fixture: ComponentFixture<CounterpartyContractComponent>) => {
    const submitButton = fixture.debugElement.query(By.css('.counterparty-contract .submit button'));
    submitButton.nativeElement.click();
    fixture.detectChanges();
}
