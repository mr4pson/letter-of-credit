import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { ErrorMessage } from '../enums/error-messages.enum';
import { SmbAlertingService } from '../interfaces';
import { NotificationService } from '../modules/ui-kit/components/notification/notification.service';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
    alertingService: SmbAlertingService | NotificationService = this.notificationService;

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
        console.error(
            `Код ошибки ${error.status}, ` + `с телом: ${error.error}`,
        );
    }
}
