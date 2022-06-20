import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { ApplicationRef, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { AppComponent } from './app.component';
import { IssueModule } from './modules/issue/issue.module';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { ErrorHandlerService } from './services/error-handler.service';
import { StorageService } from './services/storage.service';
import { PsbModule } from './modules/psb/psb.module';
import { StoreService } from './services/store.service';
import { AccountService } from './services/account.service';
import { ApiConfigurationParams } from '../api/api-configuration';
import { ApiModule } from '../api/api.module';
import { NgService } from './services/ng.service';
import { SafePaymentModule } from './modules/safepayment/safe-payment.module';
import { UiKitModule } from './modules/ui-kit/ui-kit.module';

registerLocaleData(ru);
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ApiModule.forRoot({ rootUrl: '' } as ApiConfigurationParams),
    BrowserModule,
    BrowserAnimationsModule,
    PsbModule,
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private appRef: ApplicationRef) {}
  hmrOnInit(store) {
    if (!store || !store.state) return;
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data);
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }
  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(
      cmp => cmp.location.nativeElement,
    );
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    store.restoreInputValues = createInputTransfer();
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
