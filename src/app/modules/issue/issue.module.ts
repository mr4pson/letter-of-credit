import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDropzoneModule } from 'ngx-dropzone';

import { WaitSpinnerComponent } from '../wait-spinner/wait-spinner.component';
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

import { FormatMoneyPipe } from 'src/app/pipes/format-money.pipe';
import { SimplebarAngularModule } from 'simplebar-angular';
import { SecurePipe } from 'src/app/pipes/security.pipe';

@NgModule({
  declarations: [
    // Components
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
    SecurePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    PsbModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    SimplebarAngularModule,
    IssueRoutingModule,
  ],
  exports: [
    IssueComponent,
  ],
  providers: [
    FileUploadService,
    PartnersService,
    ClientAccountService,
    StepService,
  ],
})
export class IssueModule {}
