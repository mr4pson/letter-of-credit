import { Component, Inject, OnInit } from '@angular/core';
import { ButtonSize, ButtonType, DialogRefService, DIALOG_DATA_TOKEN, SuccessModalType } from '@psb/fe-ui-kit';

@Component({
    selector: 'app-success-modal',
    templateUrl: 'success-modal.component.html',
    styleUrls: ["success-modal.component.scss"],
})
export class SuccessModalComponent implements OnInit {
    buttonSize = ButtonSize;
    buttonType = ButtonType;
    successModalType = SuccessModalType;
    contentChangingDebounceTime = 100;

    constructor(
        private dialogRef: DialogRefService<SuccessModalComponent>,
        @Inject(DIALOG_DATA_TOKEN) public data: any
    ) {
    }

    close(result) {
        let dialogResult = result;

        if (dialogResult && this.data.successDialogResult !== undefined) {
            dialogResult = this.data.successDialogResult;
        }

        this.dialogRef.close(dialogResult);
    }

    bannerClick() {
        const { bannerData } = this.data;
        if (bannerData.bannerClick) {
            bannerData.bannerClick();
        }
    }

    ngOnInit(): void {
        this.data.successButtonText = this.data.successButtonText || 'Хорошо';
    }
}
