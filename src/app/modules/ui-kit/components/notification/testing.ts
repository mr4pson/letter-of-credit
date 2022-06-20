import { ComponentFixture } from "@angular/core/testing"
import { By } from "@angular/platform-browser"
import { NotificationComponent } from "./notification.component";

export const getNotificationsWrapper = (fixture: ComponentFixture<NotificationComponent>) => {
  return fixture.debugElement.query(By.css('.notifications-wrapper'));
}
