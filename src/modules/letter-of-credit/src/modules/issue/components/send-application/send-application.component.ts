import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
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
import { StoreService } from "../../../../services/store.service";
import { NgService } from "../../../../services/ng.service";
import { isFormValid } from "../../../../utils";
import { SuccessModalComponent } from "../success-modal/success-modal.component";
import { smbPaths } from '../../../../constants/smp-paths.constant';
import { SmbPage } from "../../../../enums/smb-page.enum";
import { ErrorHandlerService, StorageService } from "../../../../services";
import { LetterService } from "../../../../api/services";
import moment from "moment";
import { FileUploadService } from "../../services/file-upload.service";
import { toBase64 } from "../../../../utils/to-base64";
import { getNdsSum } from "./helpers";
import { takeUntilDestroyed, UntilDestroy } from "@psb/angular-tools";
import { ApplicationFile } from "../../interfaces/application-file.inteface";

@Component({
    selector: "send-application",
    templateUrl: "send-application.component.html",
    styleUrls: ["send-application.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class SendApplicationComponent implements OnInit {
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
    ) { }

    ngOnInit(): void {
        this.subscribeOnFormFieldsChanges();

        this.form.patchValue(this.store.letterOfCredit);
    }

    private subscribeOnFormFieldsChanges(): void {
        merge(
            this.formService.contactPerson.valueChanges.pipe(
                tap((contactPerson) => {
                    this.store.letterOfCredit.contactPerson = this.form.get(SendApplicationFormField.ContactPerson).valid
                        ? contactPerson
                        : "";
                })
            ),
            this.formService.contactPhone.valueChanges.pipe(
                tap((contactPhone) => {
                    this.store.letterOfCredit.contactPhone = this.form.get(SendApplicationFormField.ContactPhone).valid
                        ? contactPhone
                        : "";
                })
            )
        )
            .pipe(takeUntilDestroyed(this))
            .subscribe();
    }

    async handleSubmit(): Promise<void> {
        if (isFormValid(this.form)) {
            const clientId = this.storageService.getClientID();
            const branchId = this.storageService.getBranchID();
            this.loading = true;

            from(this.getFiles()).pipe(
                switchMap((files) => {
                    return this.letterService.apiLcDocumentsClientIdCreatePost$Plain({
                        clientId,
                        branchId,
                        body: this.store.getLcDocumentsClientIdCreatePayload(files)
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
                takeUntilDestroyed(this)
            ).subscribe()
        }
    }

    private async getFiles(): Promise<ApplicationFile[]> {
        const files: ApplicationFile[] = [];

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
                takeUntilDestroyed(this)
            )
            .subscribe();
    }
}
