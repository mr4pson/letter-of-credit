import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { NotificationComponent } from './notification.component';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';

import { NotificationType } from '@psb/fe-ui-kit';
import { getNotificationsWrapper } from './testing.utils';

describe('NotificationComponent', () => {
    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;
    let notificationService: NotificationService;
    const notifications$$ = new BehaviorSubject([]);

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                NotificationModule,
            ],
            providers: [
                {
                    provide: NotificationService,
                    useValue: {
                        notifications$: notifications$$.asObservable(),
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationComponent);
        component = fixture.componentInstance;
        notificationService = TestBed.inject(NotificationService);

        fixture.detectChanges();
    });

    it('При пустом списке уведомлений не отображает уведомления', () => {
        notifications$$.next([]);
        fixture.detectChanges();

        const notificationsWrapper = getNotificationsWrapper(fixture);

        expect(notificationsWrapper.children.length).toEqual(0);
    });

    it('При инициализации одного уведомления отображает его внутри компонента', () => {
        notifications$$.next([
            {
                id: 1,
                message: 'test',
                type: NotificationType.Error,
            },
        ]);
        fixture.detectChanges();

        const notificationsWrapper = getNotificationsWrapper(fixture);

        expect(notificationsWrapper.children.length).toEqual(1);
    });
});
