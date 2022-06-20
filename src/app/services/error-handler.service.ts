import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { ErrorMessage } from '../enums/error-messages.enum';
import { SmbAlertingService } from '../interfaces';
import { NotificationService } from '../modules/ui-kit/components/notification/notification.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  alertingService: SmbAlertingService | NotificationService = this.notificationService;
  private errorMsg = '';

  constructor(
    private notificationService: NotificationService,
  ) {
    this.injectHandler(this.notificationService);
  }

  injectHandler(alertingService: SmbAlertingService | NotificationService) {
    this.alertingService = alertingService;
  }

  showErrorMessage(message: string): void {
    this.alertingService.addError({ info: message });
  }

  handleError(error: HttpErrorResponse): void {
    console.log(
      `Код ошибки ${error.status}, ` + `с телом: ${error.error}`,
   );
    if (!navigator.onLine) {
      this.errorMsg = ErrorMessage.NETWORK_ISSUE;
    } else if (error.status === 401) {
      document.location.href = '/';
    } else {
      this.errorMsg = ErrorMessage.SERVER_ISSUE;
    }
    alert(this.errorMsg);
  }
}
