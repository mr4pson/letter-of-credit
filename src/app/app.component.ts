import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { EMPTY, forkJoin, from, fromEvent, merge, Observable, of } from 'rxjs';
import { catchError, debounceTime, delay, filter, map, pairwise, switchMap, takeUntil, tap } from 'rxjs/operators';

import {
    GET_ACCREDITIVE_INFO_ERROR_MESSAGE,
    GET_COUNTERPARTY_INFO_ERROR_MESSAGE,
    NEW_LOC_BUTTON_CLASS_LIST,
    NEW_LOC_BUTTON_STYLES,
    NEW_LOC_BUTTON_TEXT,
} from './constants';
import { SafePaymentButton } from './enums/safe-payment-button.enum';
import { SmbPage } from './enums/smb-page.enum';
import { smbPaths } from './constants/smp-paths.constant';
import { SafePaymentComponent } from './modules/safepayment/safe-payment.component';
import { Page, paths } from './modules/issue/constants/routes';
import { AccountService, ErrorHandlerService, NgService, StoreService } from './services';
import { SmbPaymentFormComponent } from './interfaces';

import { BaseModalComponent } from '@psb/fe-ui-kit';

@Component({
    selector: 'loc-inner',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends OnDestroyMixin {
    isIssueVissible$ = this.store.isIssueVissible$;

    constructor(
        private store: StoreService,
        private dialog: MatDialog,
        private ngService: NgService,
        private renderer: Renderer2,
        private accountService: AccountService,
        private router: Router,
        private errorHandler: ErrorHandlerService,
    ) {
        super();

        this.ngService.setRenderer(this.renderer);
        this.initSmbApp();
    }

    handleOpenIssue(): void {
        if (!this.store.payment) {
            this.store.restoreDefaultState();
        }

        this.ngService.hideSmbDocuments();
        this.store.isIssueVissible = true;
        this.router.navigateByUrl(paths[Page.ACCREDITATION_AMOUNT]);
    }

    private initSmbApp(): void {
        const smbApp = this.ngService.getSmbAppComponent();

        if (!smbApp) {
            this.store.isIssueVissible = true;

            return;
        }

        this.errorHandler.injectHandler(smbApp.alertingService);

        merge(
            this.navigationChangeObservable(smbApp.router),
            smbApp.router.events.pipe(
                filter((events: any) => events.urlAfterRedirects && !events.state),
                debounceTime(100),
                switchMap(this.navigationChangeObservable),
            ),
        ).pipe(
            filter(isNavAllowed => isNavAllowed !== false),
            delay(100),
            switchMap(this.getIsLoCVisible.bind(this)),
            filter(isLoCVisible => isLoCVisible),
            switchMap(() => {
                const smbPaymentForm = this.ngService.getSmbPaymentFormComponent();
                const smbSavePublishBlock = this.ngService.getSmbSavePublishBlockComponent();

                const handleSubmit = () => {
                    smbPaymentForm.validate();

                    if (!smbSavePublishBlock.form.valid) {
                        return;
                    }

                    this.store.payment = smbPaymentForm.payment;
                    smbPaymentForm.popupService.dialogService.closeAll();
                    this.openSafePaymentDialog(smbPaymentForm);
                };

                smbSavePublishBlock.send = handleSubmit.bind(smbSavePublishBlock);
                smbSavePublishBlock.save = handleSubmit.bind(smbSavePublishBlock);
                smbSavePublishBlock.sign = handleSubmit.bind(smbSavePublishBlock);

                return of(true);
            }),
            catchError((error) => {
                this.initSmbApp();

                return of(EMPTY);
            }),
            takeUntil(smbApp.destroyed$),
        ).subscribe();
    }

    private navigationChangeObservable = (event: NavigationEnd | Router): Observable<any> => {
        this.store.isIssueVissible = false;
        this.store.isOrdinalPayment = false;

        if (event.url?.includes(smbPaths[SmbPage.Documents])) {
            const smbApp = this.ngService.getSmbAppComponent();

            const clientId = smbApp.clientInfoService.getDefaultClientId();
            const branchId = smbApp.clientInfoService.getDefaultBranchId();

            return from(smbApp.accountAuxService.loadAccounts(clientId, branchId)).pipe(
                delay(100),
                switchMap(() => {
                    const documentsNewPaymentButton = this.ngService.getDocumentsNewPaymentButtonElement();
                    this.createNewLocButton(documentsNewPaymentButton);

                    return of(false);
                }),
            );
        }

        if (event.url?.includes(smbPaths[SmbPage.CreatePayment])) {
            return of(true);
        }

        return of(false);
    }

    private getIsLoCVisible(): Observable<boolean> {
        const smbPaymentForm = this.ngService.getSmbPaymentFormComponent();
        const receiverAutocomplete = this.ngService.getSmbReceiverAutocompleteComponent();

        if (this.store.isOrdinalPayment) {
            this.store.isOrdinalPayment = false;

            return of(false);
        }

        return receiverAutocomplete.receiverFormGroup.valueChanges.pipe(
            map(() => receiverAutocomplete.receiverFormGroup.valid),
            pairwise(),
            filter(([cur, prev]) => (
                cur !== prev
                && receiverAutocomplete.receiverFormGroup.valid
            )),
            tap(() => {
                smbPaymentForm.spinnerService.start(smbPaymentForm.paymentFormContext);
            }),
            switchMap(() => forkJoin([
                // this.accountService.getAllowLoC(receiverAutocomplete.receiverFormGroup.value.inn).pipe(
                //   catchError(() => {
                //     this.errorHandler.showErrorMessage(GET_ACCREDITIVE_INFO_ERROR_MESSAGE);

                //     return of(false);
                //   }),
                // ),
                this.accountService.getIsBadReliability(receiverAutocomplete.receiverFormGroup.value.inn).pipe(
                    catchError(() => {
                        this.errorHandler.showErrorMessage(GET_COUNTERPARTY_INFO_ERROR_MESSAGE);

                        return of(false);
                    }),
                ),
            ])),
            map(([isLoCAllowed
                // , isBadReliability
            ]) => {
                smbPaymentForm.spinnerService.stop(smbPaymentForm.paymentFormContext);

                return isLoCAllowed
                //  && isBadReliability;
            }),
        );
    }

    private openSafePaymentDialog(smbPaymentForm: SmbPaymentFormComponent): void {
        const dialogData = {
            title: 'Рекомендуем безопасный платёж',
            component: SafePaymentComponent,
        };

        const safePaymentDialog = this.dialog.open(BaseModalComponent, {
            data: {
                ...dialogData,
            },
            panelClass: ['loc-overlay', 'loc-payment'],
            backdropClass: 'loc-backdrop',
        });

        safePaymentDialog.afterClosed().pipe(
            tap((result) => {
                switch (result) {
                    case SafePaymentButton.RefusePay:
                        this.store.isOrdinalPayment = false;
                        smbPaymentForm.popupService.dialogService.closeAll();

                        break;
                    case false:
                    case SafePaymentButton.OrdinalPay:
                        // this.doOrdinalPay();
                        this.store.isOrdinalPayment = true;
                        this.router.navigateByUrl(paths[SmbPage.CreatePayment]);
                }
            }),
            untilComponentDestroyed(this),
        ).subscribe();
    }

    private createNewLocButton(newPaymentButton: Element): void {
        const newLocbtn = this.renderer.createElement('button');

        newLocbtn.classList.add(...NEW_LOC_BUTTON_CLASS_LIST);
        newLocbtn.innerText = NEW_LOC_BUTTON_TEXT;
        newLocbtn.style.cssText = NEW_LOC_BUTTON_STYLES;

        this.renderer.listen(newLocbtn, 'click', () => {
            this.handleOpenIssue();
        });
        this.renderer.appendChild(newPaymentButton.parentNode, newLocbtn);
    }
}
