import { TestBed } from '@angular/core/testing';

import { NotificationService } from '../modules/ui-kit/components/notification/notification.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let notificationService: NotificationService;

  beforeEach(() => {
    spyOn(ErrorHandlerService.prototype, 'injectHandler');

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        {
          provide: NotificationService,
          useValue: {
            addError: (config: { info: string }) => {},
          },
        },
      ],
    });

    service = TestBed.inject(ErrorHandlerService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should inject handler on creation', () => {
    expect(ErrorHandlerService.prototype.injectHandler).toHaveBeenCalled();
  });

  it('should add error on showErrorMessage', () => {
    spyOn(service.alertingService, 'addError');

    service.showErrorMessage('Test');

    expect(service.alertingService.addError).toHaveBeenCalled();
  });
});
