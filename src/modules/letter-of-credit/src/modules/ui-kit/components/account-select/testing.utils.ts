import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser"

export const clickHeader = (wrapperFixture): void => {
    const header = wrapperFixture.debugElement.query(By.css('.account-select .dropdown-header'));
    header.nativeElement.click();
    wrapperFixture.detectChanges();
}

export const clickOutside = (wrapperFixture): void => {
    const header = wrapperFixture.debugElement.query(By.css('#outside'));
    header.nativeElement.click();
    wrapperFixture.detectChanges();
}

export const getItemsWrapper = (wrapperFixture): DebugElement => {
    return wrapperFixture.debugElement.query(By.css('.account-select .items'));
}
