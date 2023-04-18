import { Injectable, Renderer2 } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { UntilDestroy, takeUntilDestroyed } from "@psb/angular-tools";
import { DialogService, DialogSize, IBaseDialogData, SimpleDialogComponent } from "@psb/fe-ui-kit";
import { EMPTY, Observable, forkJoin, from, merge, of } from "rxjs";
import { catchError, debounceTime, delay, filter, map, pairwise, switchMap, takeUntil, tap } from "rxjs/operators";
import { GET_COUNTERPARTY_INFO_ERROR_MESSAGE, NEW_LOC_BUTTON_CLASS_LIST, NEW_LOC_BUTTON_STYLES, NEW_LOC_BUTTON_TEXT } from "./constants";
import { smbPaths } from "./constants/smp-paths.constant";
import { SafePaymentButton } from "./enums/safe-payment-button.enum";
import { SmbPage } from "./enums/smb-page.enum";
import { Page, paths } from "./modules/issue/constants/routes";
import { SafePaymentComponent } from "./modules/safepayment/safe-payment.component";
import { AccountService, ErrorHandlerService, NgService, StoreService } from "./services";

@Injectable()
@UntilDestroy()
export class LetterOfCreditService {
    isIssueVissible$ = this.store.isIssueVissible$;

    constructor(
        private store: StoreService,
        private ngService: NgService,
        // private renderer: Renderer2,
        private accountService: AccountService,
        private router: Router,
        private errorHandler: ErrorHandlerService,
        private dialogService: DialogService,
    ) {
        // this.ngService.setRenderer(this.renderer);
        // this.openSafePaymentDialog({});
    }

    handleOpenIssue(): void {
        this.store.restoreDefaultState();

        this.store.isIssueVissible = true;
        this.router.navigateByUrl(paths[Page.ACCREDITATION_AMOUNT]);
    }

    handleCloseIssue(): void {
        this.store.isIssueVissible = false;
    }

    private connectToSmbApp(): void {
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

                this.store.buttonsOldConfig = {
                    send: smbSavePublishBlock.send,
                    save: smbSavePublishBlock.save,
                    sign: smbSavePublishBlock.sign,
                }
                smbSavePublishBlock.send = handleSubmit.bind(smbSavePublishBlock);
                smbSavePublishBlock.save = handleSubmit.bind(smbSavePublishBlock);
                smbSavePublishBlock.sign = handleSubmit.bind(smbSavePublishBlock);

                return of(true);
            }),
            catchError((error) => {
                this.connectToSmbApp();

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
                delay(200),
                switchMap(() => {
                    const documentsNewPaymentButton = this.ngService.getDocumentsNewPaymentButtonElement();
                    // this.createNewLocButton(documentsNewPaymentButton);

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
                //     catchError(() => {
                //         this.errorHandler.showErrorMessage(GET_ACCREDITIVE_INFO_ERROR_MESSAGE);

                //         return of(false);
                //     }),
                // ),
                this.accountService.getIsBadReliability(receiverAutocomplete.receiverFormGroup.value.inn).pipe(
                    catchError(() => {
                        this.errorHandler.showErrorMessage(GET_COUNTERPARTY_INFO_ERROR_MESSAGE);

                        return of(false);
                    }),
                ),
            ])),
            map(([
                // isLoCAllowed, 
                isBadReliability]) => {
                smbPaymentForm.spinnerService.stop(smbPaymentForm.paymentFormContext);

                return isBadReliability
                // && isLoCAllowed;
            }),
        );
    }

    private openSafePaymentDialog(smbPaymentForm: any): void {
        const dialogData: IBaseDialogData = {
            title: 'Рекомендуем безопасный платёж',
            component: SafePaymentComponent,
            contentData: {
                width: '100px',
            }
        };

        const dialogRef = this.dialogService.open<
            IBaseDialogData,
            any,
            SimpleDialogComponent<SafePaymentButton>
        >(SimpleDialogComponent, dialogData, {
            size: DialogSize.Medium
        });

        dialogRef.afterClosed
            .pipe(
                tap((result) => {
                    switch (result) {
                        case SafePaymentButton.RefusePay:
                            this.store.isOrdinalPayment = false;
                            // smbPaymentForm.popupService.dialogService.closeAll();

                            break;
                        case false:
                        case SafePaymentButton.OrdinalPay:
                            this.store.isOrdinalPayment = true;
                            const smbSavePublishBlock = this.ngService.getSmbSavePublishBlockComponent();
                            smbSavePublishBlock.send = this.store.buttonsOldConfig.send;
                            smbSavePublishBlock.save = this.store.buttonsOldConfig.save;
                            smbSavePublishBlock.sign = this.store.buttonsOldConfig.sign;
                            break;
                    }
                }),
                takeUntilDestroyed(this)
            )
            .subscribe();
    }
}