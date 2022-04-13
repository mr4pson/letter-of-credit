import {BrowserModule} from '@angular/platform-browser';
import {NgModule, LOCALE_ID} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
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
import {SafePaymentAgendaComponent} from "./components/safepayment/safe-payment-agenda.component";
import {SafePaymentEmailComponent} from "./components/safepayment/safe-payment-email.component";
import {IssueComponent} from "./components/issue/issue.component";
import {IssueStepsComponent} from "./components/issue/issue-steps.component";
import {IssueSuccessComponent} from "./components/issue/issue-success.component";
import {IssueStep1Component} from "./components/issue/issue-step1.component";
import {IssueStep2Component} from "./components/issue/issue-step2.component";
import {IssueStep3Component} from "./components/issue/issue-step3.component";
import {IssueStep4Component} from "./components/issue/issue-step4.component";
import {IssueStep5Component} from "./components/issue/issue-step5.component";

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
		IssueStep1Component,
		IssueStep2Component,
		IssueStep3Component,
		IssueStep4Component,
		IssueStep5Component,
	],
	imports: [
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
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
