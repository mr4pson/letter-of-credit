import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import ru from '@angular/common/locales/ru';
import { ApplicationRef, LOCALE_ID, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AppComponent } from './app.component';
import { CloseIconComponent } from './components/close-icon/close-icon.component';
import { EmptyComponent } from './components/empty/empty.component';
import { AccreditationAmountComponent } from './components/issue/accreditation-amount/accreditation-amount.component';
import { AccreditationPeriodComponent } from './components/issue/accreditation-period/accreditation-period.component';
import { ClosingDocComponent } from './components/issue/accreditation-period/closing-doc/closing-doc.component';
import {
  CounterpartyContractComponent,
} from './components/issue/counterparty-contract/counterparty-contract.component';
import { СounterpartyComponent } from './components/issue/counterparty/counterparty.component';
import { IssueStepsComponent } from './components/issue/issue-steps/issue-steps.component';
import { IssueSuccessComponent } from './components/issue/issue-success/issue-success.component';
import { IssueComponent } from './components/issue/issue.component';
import { SendApplicationComponent } from './components/issue/send-application/send-application.component';
import { SafePaymentEmailComponent } from './components/safepayment/safe-payment-email/safe-payment-email.component';
import { SafePaymentComponent } from './components/safepayment/safe-payment.component';
import { SafePaymentAgendaComponent } from './components/safepayment/safe-paymet-agenda/safe-payment-agenda.component';
import { WaitSpinnerComponent } from './components/wait-spinner/wait-spinner.component';
import { HttpErrorInterceptor } from './http-error.interceptor';
import { MaterialModule } from './material/material-module';
import { ModelsModule } from './models/models.module';
import { ErrorHandlerService } from './services/error-handler.service';
import { StorageService } from './services/storage.service';
import { FormatMoneyPipe } from './pipes/format-money.pipe';

import { BaseModalModule } from '@psb/fe-ui-kit/src/components/base-modal';
import { ButtonModule } from '@psb/fe-ui-kit/src/components/button';
import { CheckboxModule } from '@psb/fe-ui-kit/src/components/checkbox';
import { DatepickerModule } from '@psb/fe-ui-kit/src/components/datepicker';
import { DropdownModule } from '@psb/fe-ui-kit/src/components/dropdown';
import { FormFieldModule } from '@psb/fe-ui-kit/src/components/form-field';
import { HeadingModule } from '@psb/fe-ui-kit/src/components/heading';
import { IconModule } from '@psb/fe-ui-kit/src/components/icon';
import { InputAutocompleteModule } from '@psb/fe-ui-kit/src/components/input-autocomplete';
import { InputSelectModule } from '@psb/fe-ui-kit/src/components/input-select';
import { NumberInputModule } from '@psb/fe-ui-kit/src/components/number-input';
import { PhoneInputModule } from '@psb/fe-ui-kit/src/components/phone-input';
import { SpinnerIconModule } from '@psb/fe-ui-kit/src/components/spinner-icon';
import { TextModule } from '@psb/fe-ui-kit/src/components/text';
import { TextInputModule } from '@psb/fe-ui-kit/src/components/text-input';
import { TooltipModule } from '@psb/fe-ui-kit/src/components/tooltip';
import { TemplateTypeModule } from '@psb/fe-ui-kit/src/directives/template-type';
import { SimplebarAngularModule } from 'simplebar-angular';
import { ApiConfigurationParams } from 'src/api/api-configuration';
import { ApiModule } from 'src/api/api.module';

registerLocaleData(ru);
@NgModule({
  declarations: [
    // Components
    AppComponent,
    EmptyComponent,
    SafePaymentComponent,
    SafePaymentAgendaComponent,
    SafePaymentEmailComponent,
    CloseIconComponent,
    IssueComponent,
    IssueStepsComponent,
    IssueSuccessComponent,
    WaitSpinnerComponent,
    AccreditationAmountComponent,
    СounterpartyComponent,
    CounterpartyContractComponent,
    AccreditationPeriodComponent,
    SendApplicationComponent,
    ClosingDocComponent,
    // Pipes
    FormatMoneyPipe,
  ],
  imports: [
    ApiModule.forRoot({ rootUrl: '' } as ApiConfigurationParams),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxDropzoneModule,
    SimplebarAngularModule,
    ModelsModule,
    TooltipModule,
    CheckboxModule,
    ButtonModule,
    TextInputModule,
    TextModule,
    HeadingModule,
    NumberInputModule,
    IconModule,
    FormFieldModule,
    SpinnerIconModule,
    InputSelectModule,
    DropdownModule,
    InputAutocompleteModule,
    TemplateTypeModule,
    DatepickerModule,
    BaseModalModule,
    PhoneInputModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    StorageService,
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
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
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
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = { data: 'yolo' };
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
    // anything you need done the component is removed
  }
}
