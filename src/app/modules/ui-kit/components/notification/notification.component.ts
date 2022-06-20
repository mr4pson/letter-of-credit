import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NotificationService } from './notification.service';

@Component({
  selector: 'loc-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent {
  notifications$ = this.notificationService.notifications$;

  constructor(
    private notificationService: NotificationService,
  ) {}
}
