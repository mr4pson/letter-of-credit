import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Notification } from './notification.interface';

import { NotificationType } from '@psb/fe-ui-kit';


@Injectable()
export class NotificationService {
    private notifications$$ = new BehaviorSubject<Notification[]>([]);
    notifications$: Observable<Notification[]>;
    get notifications(): Notification[] {
        return this.notifications$$.getValue();
    }
    set notifications(list) {
        this.notifications$$.next(list);
    }

    private lastNotificationId = 0;

    constructor() {
        this.notifications$ = this.notifications$$.asObservable().pipe(
            tap((notifications) => {
                if (notifications.length > 0) {
                    setTimeout(this.removeNotification.bind(this), 3000);
                }
            }),
        );
    }

    addError(config: { info: string }): void {
        const notification: Notification = {
            message: config.info,
            id: this.lastNotificationId,
            type: NotificationType.Error,
        };
        this.notifications = [...this.notifications, notification];
        this.lastNotificationId += 1;
    }

    private removeNotification(): void {
        const notifications = [...this.notifications];
        notifications.shift();
        this.notifications = notifications;
    }
}
