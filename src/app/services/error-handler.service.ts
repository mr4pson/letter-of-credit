import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';

export enum ErrorMessages {
  NETWORK_ISSUE = 'Проверьте ваше интернет соединение и попробуй ещё раз',
  SERVER_ISSUE = 'Извините. Сервер сейчас не доступен',
}

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
  private errorMsg = '';
  constructor(@Inject(Injector) private injector: Injector) {}

  handleError(error: string): void {
    alert(error);
  }

  handleStatusError(error: HttpErrorResponse): void {
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
