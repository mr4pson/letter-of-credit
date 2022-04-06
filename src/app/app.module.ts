import {BrowserModule} from '@angular/platform-browser';
import {NgModule, LOCALE_ID, ApplicationRef} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';

import {registerLocaleData} from "@angular/common";
import localeRu from "@angular/common/locales/ru";

registerLocaleData(localeRu)

import {NgxDropzoneModule} from "ngx-dropzone";
import {SimplebarAngularModule} from "simplebar-angular";

import {AppComponent} from './app.component';
import {ModelsModule} from './models/models.module';
import {MaterialModule} from './material/material-module';

import {EmptyComponent} from './components/empty/empty.component';
import {CloseIconComponent} from "./components/close-icon/close-icon.component";
import {WaitSpinnerComponent} from "./components/wait-spinner/wait-spinner.component";
import {SafePaymentComponent} from "./components/safepayment/safe-payment.component";
import {SafePaymentAgendaComponent} from "./components/safepayment/safe-paymet-agenda/safe-payment-agenda.component";
import {SafePaymentEmailComponent} from "./components/safepayment/safe-payment-email/safe-payment-email.component";
import {IssueComponent} from "./components/issue/issue.component";
import {IssueStepsComponent} from "./components/issue/issue-steps/issue-steps.component";
import {IssueSuccessComponent} from "./components/issue/issue-success/issue-success.component";
import { AccreditationAmountComponent } from './components/issue/accreditation-amount/accreditation-amount.component';
import { СounterpartyComponent } from './components/issue/counterparty/counterparty.component';
import { CounterpartyContractComponent } from './components/issue/counterparty-contract/counterparty-contract.component';
import { AccreditationPeriodComponent } from './components/issue/accreditation-period/accreditation-period.component';
import { ClosingDocComponent } from './components/issue/accreditation-period/closing-doc/closing-doc.component';
import {SendApplicationComponent} from "./components/issue/send-application/send-application.component";

import {TooltipModule} from "@psb/fe-ui-kit/src/components/tooltip";
import {CheckboxModule} from "@psb/fe-ui-kit/src/components/checkbox";
import {ButtonModule} from "@psb/fe-ui-kit/src/components/button";
import {IconModule} from "@psb/fe-ui-kit/src/components/icon";
import {FormFieldModule} from "@psb/fe-ui-kit/src/components/form-field";
import {TextInputModule} from "@psb/fe-ui-kit/src/components/text-input";
import {TextModule} from "@psb/fe-ui-kit/src/components/text";
import {NumberInputModule} from "@psb/fe-ui-kit/src/components/number-input";
import {SpinnerIconModule} from "@psb/fe-ui-kit/src/components/spinner-icon";
import {InputSelectModule} from "@psb/fe-ui-kit/src/components/input-select";
import {DropdownModule} from "@psb/fe-ui-kit/src/components/dropdown";
import {InputAutocompleteModule} from "@psb/fe-ui-kit/src/components/input-autocomplete";
import {DatepickerModule} from "@psb/fe-ui-kit/src/components/datepicker";
import {BaseModalModule} from "@psb/fe-ui-kit/src/components/base-modal";
import {TemplateTypeModule} from "@psb/fe-ui-kit/src/directives/template-type";
import {PhoneInputModule} from "@psb/fe-ui-kit/src/components/phone-input";
import {HeadingModule} from "@psb/fe-ui-kit/src/components/heading";
import { ApiModule } from 'src/api/api.module';
import { ApiConfigurationParams } from 'src/api/api-configuration';

import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { StorageService } from './services/storage.service';
import { HttpErrorInterceptor } from './http-error.interceptor';

import { ErrorHandlerService } from './services/error-handler.service';

@NgModule({
	declarations: [
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
	],
	imports: [
		ApiModule.forRoot({ rootUrl: "" } as ApiConfigurationParams),
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
		{provide: LOCALE_ID, useValue: 'ru'},
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
		console.log("HMR store", store);
		console.log("store.state.data:", store.state.data);
		// inject AppStore here and update it
		// this.AppStore.update(store.state)
		if ("restoreInputValues" in store) {
			store.restoreInputValues();
		}
		// change detection
		this.appRef.tick();
		delete store.state;
		delete store.restoreInputValues;
	}
	hmrOnDestroy(store) {
		var cmpLocation = this.appRef.components.map(
			(cmp) => cmp.location.nativeElement
		);
		// recreate elements
		store.disposeOldHosts = createNewHosts(cmpLocation);
		// inject your AppStore and grab state then set it on store
		// var appState = this.AppStore.get()
		store.state = { data: "yolo" };
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
