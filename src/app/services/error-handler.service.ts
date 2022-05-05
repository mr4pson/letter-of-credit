import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

import { SmbAlertingService } from '../interfaces';

export enum ErrorMessages {
  NETWORK_ISSUE = 'Проверьте ваше интернет соединение и попробуй ещё раз',
  SERVER_ISSUE = 'Извините. Сервер сейчас не доступен',
}

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  public alertingService: SmbAlertingService;
  private errorMsg = '';

  public injectHandler(alertingService: SmbAlertingService) {
    this.alertingService = alertingService;
  }

  // TODO поменять на psb нотификатор
  public showErrorMesssage(message: string): void {
    if (!this.alertingService) {
      alert(message);

      return;
    }

    this.alertingService.addError({ info: message });
  }

  public handleError(error: HttpErrorResponse): void {
    console.log(
      `Error code ${error.status}, ` + `body was: ${error.error}`,
   );
    if (!navigator.onLine) {
      this.errorMsg = ErrorMessages.NETWORK_ISSUE;
    } else if (error.status === 401) {
      document.location.href = '/';
    } else {
      this.errorMsg = ErrorMessages.SERVER_ISSUE;
    }
    alert(this.errorMsg);
  }
}
