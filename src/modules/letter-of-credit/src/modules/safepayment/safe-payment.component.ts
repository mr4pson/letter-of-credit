import {
    ChangeDetectionStrategy,
    Component,
    ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";

import { Page, paths } from "../issue/constants/routes";
import { SafePayStates } from "./enums/safe-payment.enum";
import { SafePaymentEmailComponent } from "./components/safe-payment-email/safe-payment-email.component";
import { SafePaymentStateManagerService } from "./services/safe-payment-state-manager.service";

import { DialogRefService } from "@psb/fe-ui-kit";
import { ButtonSize, ButtonType } from "@psb/fe-ui-kit/src/components/button";
import { SafePaymentButton } from "../../enums/safe-payment-button.enum";
import { StoreService } from "../../services/store.service";
import { SafePaymentFormField } from "./enums/safe-payment-form-field.enum";
import { NgService } from "../../services";
import { SafePaymentFormService } from "./safe-payment-form.service";
import { SafePaymentService } from "./services/safe-payment.service";
import { tap } from "rxjs/operators";
import { takeUntilDestroyed, UntilDestroy } from "@psb/angular-tools";

@Component({
    selector: "safe-payment",
    templateUrl: "safe-payment.component.html",
    styleUrls: ["safe-payment.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SafePaymentComponent {
    @ViewChild(SafePaymentEmailComponent) emailComponent: HTMLElement;

    SafePaymentButton = SafePaymentButton;
    ButtonType = ButtonType;
    ButtonSize = ButtonSize;
    form = this.formService.createForm();
    SafePaymentFormField = SafePaymentFormField;
    letterOfCredit = this.store.letterOfCredit;
    SafePayStates = SafePayStates;

    constructor(
        public stateManager: SafePaymentStateManagerService,
        public store: StoreService,
        private dialogRef: DialogRefService<SafePaymentButton>,
        private router: Router,
        private formService: SafePaymentFormService,
        private ngService: NgService,
        private safePaymentService: SafePaymentService
    ) {
        this.stateManager.state = SafePayStates.ShowAgenda;
    }

    doSafePay(): void {
        this.dialogRef.close(SafePaymentButton.DoPay);
        this.ngService.hideSmbDocuments();
        this.store.isIssueVissible = true;
        this.router.navigateByUrl(paths[Page.ACCREDITATION_AMOUNT]);
        setTimeout(() => {
            this.ngService.scrollToTop();
        }, 200);
    }

    closeDialog(payButton: SafePaymentButton = SafePaymentButton.OrdinalPay): void {
        this.dialogRef.close(payButton);
    }

    takeEmail(email: string): void {
        if (email.trim() === "") {
            return;
        }

        this.store.clientEmail = email;
        this.stateManager.state = SafePayStates.ShowAgenda;
        this.safePaymentService.loading = true;

        this.safePaymentService
            .getMaterials(email)
            .pipe(
                tap((resp) => {
                    this.safePaymentService.loading = false;
                }),
                takeUntilDestroyed(this)
            )
            .subscribe();
    }

    showEmail(): void {
        this.stateManager.state = SafePayStates.ShowEmail;
    }
}
