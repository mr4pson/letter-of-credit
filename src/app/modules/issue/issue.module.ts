import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { AccreditationAmountComponent } from './components/accreditation-amount/accreditation-amount.component';
import { AccreditationPeriodComponent } from './components/accreditation-period/accreditation-period.component';
import { ClosingDocComponent } from './components/accreditation-period/closing-doc/closing-doc.component';
import { CounterpartyContractComponent } from './components/counterparty-contract/counterparty-contract.component';
import { СounterpartyComponent } from './components/counterparty/counterparty.component';
import { IssueStepsComponent } from './components/issue-steps/issue-steps.component';
import { IssueSuccessComponent } from './components/issue-success/issue-success.component';
import { IssueComponent } from './issue.component';
import { SendApplicationComponent } from './components/send-application/send-application.component';
import { FileUploadService } from './services/file-upload.service';
import { PsbModule } from '../psb/psb.module';
import { PartnersService } from './services/partners.service';
import { ClientAccountService } from './services/client-accounts.service';
import { IssueRoutingModule } from './issue-routing.module';
import { StepService } from './services/step.service';
import { UiKitModule } from '../ui-kit/ui-kit.module';

import { SimplebarAngularModule } from 'simplebar-angular';
import { AccountService } from 'src/app/services';

@NgModule({
  declarations: [
    IssueComponent,
    ClosingDocComponent,
    IssueStepsComponent,
    IssueSuccessComponent,
    СounterpartyComponent,
    SendApplicationComponent,
    AccreditationPeriodComponent,
    AccreditationAmountComponent,
    CounterpartyContractComponent,
  ],
  imports: [
    PsbModule,
    UiKitModule,
    BrowserModule,
    HttpClientModule,
    NgxDropzoneModule,
    IssueRoutingModule,
    ReactiveFormsModule,
    SimplebarAngularModule,
    BrowserAnimationsModule,
  ],
  exports: [
    IssueComponent,
  ],
  providers: [
    StepService,
    AccountService,
    PartnersService,
    FileUploadService,
    ClientAccountService,
  ],
})
export class IssueModule {}
