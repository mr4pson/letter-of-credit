import { By } from "@angular/platform-browser"

export const clickHeader = (wrapperFixture) => {
  const header = wrapperFixture.debugElement.query(By.css('.account-select .dropdown-header'));
  header.nativeElement.click();
  wrapperFixture.detectChanges();
}

export const clickOutside = (wrapperFixture) => {
  const header =  wrapperFixture.debugElement.query(By.css('#outside'));
  header.nativeElement.click();
  wrapperFixture.detectChanges();
}

export const getItemsWrapper = (wrapperFixture) => {
  return wrapperFixture.debugElement.query(By.css('.account-select .items'));
}
