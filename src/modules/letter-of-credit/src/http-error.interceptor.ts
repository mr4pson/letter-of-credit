import { Injectable } from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

import { ErrorHandlerService, StorageService } from "./services";

// import { environment } from "../environments/environment";
const domain = 'http://localhost:4200';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private storage: StorageService,
    private errorHandler: ErrorHandlerService
  ) { }
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.responseType === "blob") {
      return next.handle(
        req.clone({ url: `${domain}/${req.url}` })
      );
    }

    const accessToken = this.storage.getAccessToken();
    if (!accessToken) {
      return next.handle(req);
    }

    return next
      .handle(
        req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        })
      )
      .pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          this.errorHandler.showErrorMessage(error.message);
          return throwError(error);
        })
      ) as Observable<HttpEvent<any>>;
  }
}
