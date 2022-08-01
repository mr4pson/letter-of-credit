import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AccreditationPeriodComponent } from "./accreditation-period.component";

export const clickAddDocBtn = (fixture: ComponentFixture<AccreditationPeriodComponent>) => {
    const addDocBtn = fixture.debugElement.query(By.css('.add-doc-btn'));
    addDocBtn.nativeElement.click();
    fixture.detectChanges();
}

export const getClosingDocs = (fixture: ComponentFixture<AccreditationPeriodComponent>) => {
    return fixture.debugElement.query(By.css('.closing-docs'));
}

export const clickRemoveBtn = (closingDocs: DebugElement, fixture: ComponentFixture<AccreditationPeriodComponent>) => {
    const removeBtn = closingDocs.children[0].query(By.css('.docs-holder .remove-btn'));
    removeBtn.nativeElement.click();
    fixture.detectChanges();
}

export const clickSubmitButton = (fixture: ComponentFixture<AccreditationPeriodComponent>) => {
    const submitButton = fixture.debugElement.query(By.css('.accreditation-period .submit button'));
    submitButton.nativeElement.click();
    fixture.detectChanges();
}
