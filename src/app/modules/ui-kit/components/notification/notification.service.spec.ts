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

  it('При добавлении ошибки в сервис добавляет ее в список ошибок', () => {
    service.addError({ info: 'Test' });

    expect(service.notifications.length).toEqual(1);
  });

  it('Добавляет ошибки и затем удаляет ее через 3 секунды', fakeAsync(() => {
    service.notifications$.subscribe();
    service.addError({ info: 'Test' });

    tick(3000);

    expect(service.notifications.length).toEqual(0);
  }));
});
