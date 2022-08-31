import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
    OnDestroyMixin,
    untilComponentDestroyed,
} from "@w11k/ngx-componentdestroyed";
import { EMPTY, from, merge } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";

import { IssueSuccessComponent } from "../issue-success/issue-success.component";
import { SendApplicationFormField } from "../../enums/send-application-form-field.enum";
import { SendApplicationFormService } from "./send-application-form.service";

import {
    ButtonType,
    DialogService,
    IBaseDialogData,
} from "@psb/fe-ui-kit";
import { StoreService } from "src/app/services/store.service";
import { NgService } from "src/app/services/ng.service";
import { isFormValid } from "src/app/utils";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { smbPaths } from '../../../../constants/smp-paths.constant';
import { SmbPage } from "src/app/enums/smb-page.enum";
import { ErrorHandlerService, StorageService } from "src/app/services";
import { LetterService } from "src/api/services";
import moment from "moment";
import { FileUploadService } from "../../services/file-upload.service";
import { toBase64 } from "src/app/utils/to-base64";
import { getNdsSum } from "./helpers";

@Component({
    selector: "send-application",
    templateUrl: "send-application.component.html",
    styleUrls: ["send-application.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendApplicationComponent extends OnDestroyMixin implements OnInit {
    form = this.formService.createForm();
    ButtonType = ButtonType;
    SendApplicationFormField = SendApplicationFormField;
    loading = false;

    constructor(
        private store: StoreService,
        private storageService: StorageService,
        private ngService: NgService,
        private formService: SendApplicationFormService,
        private dialogService: DialogService,
        private letterService: LetterService,
        private fileUploadService: FileUploadService,
        private errorHandlerService: ErrorHandlerService,
    ) {
        super();
    }

    ngOnInit(): void {
        merge(
            this.formService.contactPerson.valueChanges.pipe(
                tap((contactPerson) => {
                    this.store.letterOfCredit.contactPerson = this.form.controls
                        .contactPerson.valid
                        ? contactPerson
                        : "";
                })
            ),
            this.formService.contactPhone.valueChanges.pipe(
                tap((contactPhone) => {
                    this.store.letterOfCredit.contactPhone = this.form.controls
                        .contactPhone.valid
                        ? contactPhone
                        : "";
                })
            )
        )
            .pipe(untilComponentDestroyed(this))
            .subscribe();

        this.form.patchValue(this.store.letterOfCredit);
    }

    async handleSubmit() {
        if (isFormValid(this.form)) {
            const clientId = this.storageService.getClientID();
            const branchId = this.storageService.getBranchID();
            this.loading = true;

            from(this.getFiles()).pipe(
                switchMap((files) => {
                    return this.letterService.apiLcDocumentsClientIdCreatePost$Plain({
                        clientId, branchId, body: {
                            total: this.store.letterOfCredit.paymentSum,
                            account: this.store.letterOfCredit.payerAccount,
                            contractorTitle: this.store.letterOfCredit.reciverName,
                            contractorINN: this.store.letterOfCredit.reciverInn,
                            bic: this.store.letterOfCredit.reciverBankBik,
                            contractorAccount: this.store.letterOfCredit.payerAccount,
                            contractDate: moment(this.store.letterOfCredit.contractDate).format('YYYY-MM-DD'),
                            ndsValue: this.store.letterOfCredit.nds,
                            ndsSum: getNdsSum(this.store.letterOfCredit.nds, this.store.letterOfCredit.paymentSum),
                            contractTitleAndNumber: this.store.letterOfCredit.contract,
                            contractSubject: this.store.letterOfCredit.contractInfo,
                            contractFiles: files,
                            lcEndDate: moment(this.store.letterOfCredit.endLocDate).format('YYYY-MM-DD'),
                            lcDuration: Number(this.store.letterOfCredit.locDaysNumber),
                            closingDocuments: this.store.letterOfCredit.closingDocs.map(doc => ({
                                additionalRequirements: doc.additionalRequirements,
                                documentsCount: Number(doc.amount),
                                documentTitle: doc.document,
                                originalOnly: doc.onlyOriginalDocument
                            })),
                            electronicSubmission: true,
                            partialPayment: true,
                            agreement: true,
                            addToTemplates: true,
                            contactPerson: this.store.letterOfCredit.contactPerson,
                            contactPhone: this.store.letterOfCredit.contactPhone
                        }
                    })
                }),
                tap(() => {
                    this.loading = false;
                    this.store.restoreDefaultState();
                    this.fileUploadService.files = [];
                    this.openSuccessDialog();
                }),
                catchError((error) => {
                    this.loading = false;
                    try {
                        const errorResponse = error.error ? JSON.parse(error.error) : '';
                        this.errorHandlerService.showErrorMessage(errorResponse?.message);
                    } catch (error) {
                        this.errorHandlerService.showErrorMessage('Невозможно загрузить документ');
                    }

                    return EMPTY;
                }),
                untilComponentDestroyed(this)
            ).subscribe()
        }
    }

    private async getFiles() {
        const files = [];

        for (const file of this.fileUploadService.files) {
            files.push({
                fileName: file.native.name,
                data: await toBase64(file.native)
            });
        }

        return files;
    }

    private openSuccessDialog(): void {
        const dialogData: IBaseDialogData = {
            title: "Заявка отправлена",
            component: IssueSuccessComponent,
            contentData: {
                successButtonText: 'Хорошо',
                component: IssueSuccessComponent,
            }
        };

        const dialogRef = this.dialogService.open<
            IBaseDialogData,
            any,
            SuccessModalComponent
        >(SuccessModalComponent, dialogData);

        dialogRef.afterClosed
            .pipe(
                tap(() => {
                    this.store.isIssueVissible = false;
                    this.ngService.showSmbDocuments();
                    const smbApp = this.ngService.getSmbAppComponent();

                    if (smbApp) {
                        smbApp.router.navigateByUrl(smbPaths[SmbPage.Documents]);
                    }
                }),
                untilComponentDestroyed(this)
            )
            .subscribe();
    }
}
