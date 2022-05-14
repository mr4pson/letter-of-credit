import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
    service.notifications = [];
  });

  it('should add notification in the list', () => {
    service.addError({ info: 'Test' });

    expect(service.notifications.length).toEqual(1);
  });

  it('should remove notification after 3 seconds', fakeAsync(() => {
    service.notifications$.subscribe();
    service.addError({ info: 'Test' });

    tick(3000);

    expect(service.notifications.length).toEqual(0);
  }));
});
