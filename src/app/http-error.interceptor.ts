import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ErrorHandlerService, StorageService } from './services';

import { environment } from 'src/environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private errorHandler: ErrorHandlerService,
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (req.responseType === 'blob') {
      return next.handle(
        req.clone({ url: `${environment.domain}/${req.url}` }),
      );
    }

    const accessToken = this.storage.getAccessToken();
    if (!accessToken) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        withCredentials: true,
      }),
    ).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        return throwError(error);
      }),
    ) as Observable<HttpEvent<any>>;
  }
}
