import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import {
    OnDestroyMixin,
    untilComponentDestroyed,
} from "@w11k/ngx-componentdestroyed";
import { from, merge } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

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
import { SendApplicationService } from "./send-application.service";
import { Application } from "../../interfaces/application.interface";
import { StorageService } from "src/app/services";
import { LetterService } from "src/api/services";
import moment from "moment";
import { FileUploadService } from "../../services/file-upload.service";
import { toBase64 } from "src/app/utils/to-base64";

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

    constructor(
        private store: StoreService,
        private storageService: StorageService,
        private ngService: NgService,
        private formService: SendApplicationFormService,
        private dialogService: DialogService,
        private sendApplicationService: SendApplicationService,
        private letterService: LetterService,
        private fileUploadService: FileUploadService
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

            from(this.getFiles()).pipe(
                switchMap((files) => {
                    return this.letterService.apiLcDocumentsClientIdCreatePost$Plain({
                        clientId, branchId, body: {
                            total: this.store.payment?.summa,
                            account: this.store.letterOfCredit.payerAccount,
                            contractorTitle: this.store.payment?.sender.fullName,
                            contractorINN: this.store.payment?.sender.inn,
                            bic: this.store.letterOfCredit.reciverBankBik,
                            contractorAccount: this.store.letterOfCredit.payerAccount,
                            contractDate: moment(this.store.letterOfCredit.contractDate).format('DD.MM.YYYY'),
                            ndsValue: Number(this.store.letterOfCredit.nds),
                            ndsSum: Number(this.store.letterOfCredit.nds) * this.store.payment?.summa / 100,
                            contractTitleAndNumber: this.store.letterOfCredit.contract,
                            contractSubject: this.store.letterOfCredit.contractInfo,
                            contractFiles: files,
                            lcEndDate: moment(this.store.letterOfCredit.endLocDate).format('DD.MM.YYYY'),
                            lcDuration: this.store.letterOfCredit.locDaysNumber,
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
                switchMap(() => {
                    const payload: Application = {
                        cloc_BIK: this.store.letterOfCredit.reciverBankBik,
                        cloc_TransferAccount: this.store.letterOfCredit.reciverAccount,
                        cloc_NameClient: this.store.letterOfCredit.reciverName,
                        cloc_Address: '',
                        cloc_INN: this.store.letterOfCredit.reciverInn,
                        cloc_Account: this.store.letterOfCredit.payerAccount,
                        cloc_PayerNameClient: this.store.payment?.sender.fullName,
                        cloc_PayerINN: this.store.payment?.sender.inn,
                        cloc_PayerAccount: this.store.payment?.sender.account.code,
                        cloc_Amount: this.store.letterOfCredit.paymentSum.toString(),
                        cloc_NDS: this.store.letterOfCredit.nds,
                        cloc_ValidityPeriod: this.store.letterOfCredit.locDaysNumber.toString(),
                        cloc_PayerBank: this.store.payment?.sender.bankInfo.fullName,
                        cloc_PayerBIK: this.store.payment?.sender.bankInfo.bik,
                        cloc_Purpose: this.store.letterOfCredit.contractInfo,
                        cloc_NumberDateContract: this.store.letterOfCredit.contract,
                        cloc_DocList: ''
                    };
                    return this.sendApplicationService.sendApplication(clientId, payload).pipe(
                        tap(() => {
                            this.openSuccessDialog();
                        }),
                    )
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
