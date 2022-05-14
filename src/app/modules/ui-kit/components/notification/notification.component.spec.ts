import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';

import { NotificationComponent } from './notification.component';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';

import { NotificationType } from '@psb/fe-ui-kit';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display any notification', () => {
    notifications$$.next([]);
    fixture.detectChanges();

    const notificationsWrapper = fixture.debugElement.query(By.css('.notifications-wrapper'));

    expect(notificationsWrapper.children.length).toEqual(0);
  });

  it('should display 1 notification', () => {
    notifications$$.next([
      {
        id: 1,
        message: 'test',
        type: NotificationType.Error,
      },
    ]);
    fixture.detectChanges();

    const notificationsWrapper = fixture.debugElement.query(By.css('.notifications-wrapper'));

    expect(notificationsWrapper.children.length).toEqual(1);
  });
});
