import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { ApplicationRef, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { AppComponent } from './app.component';
import { IssueModule } from './modules/issue/issue.module';
import { SafePaymentEmailComponent } from './modules/safepayment/safe-payment-email/safe-payment-email.component';
import { SafePaymentComponent } from './modules/safepayment/safe-payment.component';
import { SafePaymentAgendaComponent } from './modules/safepayment/safe-paymet-agenda/safe-payment-agenda.component';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { MaterialModule } from './modules/material/material-module';
import { ErrorHandlerService } from './services/error-handler.service';
import { StorageService } from './services/storage.service';
import { PsbModule } from './modules/psb/psb.module';
import { StoreService } from './models/state.service';
import { AccountService } from './services/account.service';
import { ApiConfigurationParams } from '../api/api-configuration';
import { ApiModule } from '../api/api.module';

registerLocaleData(ru);
@NgModule({
  declarations: [
    // Components
    AppComponent,
    SafePaymentComponent,
    SafePaymentAgendaComponent,
    SafePaymentEmailComponent,
  ],
  imports: [
    ApiModule.forRoot({ rootUrl: '' } as ApiConfigurationParams),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    PsbModule,
    IssueModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    StorageService,
    StoreService,
    AccountService,
    ErrorHandlerService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
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
