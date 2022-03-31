import { Injectable } from "@angular/core";
import {
	HttpEvent,
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { StorageService } from "./services/storage.service";
import { ErrorHandlerService } from "./services/error-handler.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
	constructor(
		private storage: StorageService,
		private errorHandler: ErrorHandlerService
	) {}
	intercept(
		req: HttpRequest<any>,
		next: HttpHandler
	): Observable<HttpEvent<any>> {
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
					this.errorHandler.handleStatusError(error);
					return throwError(error);
				})
			) as Observable<HttpEvent<any>>;
	}
}

