import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LetterOfCreditComponent } from './letter-of-credit.component';
import { IssueModule } from './modules/issue/issue.module';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { ErrorHandlerService } from './services/error-handler.service';
import { StorageService } from './services/storage.service';
import { PsbModule } from './modules/psb/psb.module';
import { StoreService } from './services/store.service';
import { AccountService } from './services/account.service';
import { NgService } from './services/ng.service';
import { SafePaymentModule } from './modules/safepayment/safe-payment.module';
import { UiKitModule } from './modules/ui-kit/ui-kit.module';
import { MaterialModule } from './modules/material/material-module';
import { SafePaymentStateManagerService } from './modules/safepayment/services/safe-payment-state-manager.service';
import { ApiModule } from './api/api.module';
import { ApiConfigurationParams } from './api/api-configuration';
import { LetterOfCreditService } from './letter-of-credit.service';

registerLocaleData(ru);
@NgModule({
    declarations: [
        LetterOfCreditComponent,
    ],
    imports: [
        ApiModule.forRoot({ rootUrl: '' } as ApiConfigurationParams),
        BrowserModule,
        BrowserAnimationsModule,
        PsbModule,
        MaterialModule,
        UiKitModule,
        IssueModule,
        SafePaymentModule,
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'ru' },
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
        StorageService,
        StoreService,
        AccountService,
        ErrorHandlerService,
        NgService,
        SafePaymentStateManagerService,
        LetterOfCreditService,
    ],
    exports: [
        LetterOfCreditComponent,
        PsbModule,
        MaterialModule,
        UiKitModule,
        IssueModule,
        SafePaymentModule,
    ],
})
export class LetterOfCreditModule { }
