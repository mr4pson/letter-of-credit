import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { PsbModule } from "../psb/psb.module";
import { SafePaymentEmailComponent } from "./components/safe-payment-email/safe-payment-email.component";
import { SafePaymentComponent } from "./safe-payment.component";
import { SafePaymentAgendaComponent } from "./components/safe-paymet-agenda/safe-payment-agenda.component";
import { SafePaymentStateManagerService } from "./services/safe-payment-state-manager.service";
import { SafePaymentFormService } from "./safe-payment-form.service";
import { SafePaymentService } from "./services/safe-payment.service";

@NgModule({
    declarations: [
        SafePaymentComponent,
        SafePaymentAgendaComponent,
        SafePaymentEmailComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        PsbModule,
    ],
    providers: [
        SafePaymentFormService,
        SafePaymentService,
        SafePaymentStateManagerService,
    ],
})
export class SafePaymentModule { }
