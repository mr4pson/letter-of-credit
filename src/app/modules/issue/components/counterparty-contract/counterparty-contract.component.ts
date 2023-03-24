import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Router } from '@angular/router';

import { NDS_LIST, ruLocaleDateConfig } from '../../constants/constants';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploaded } from '../../interfaces/file-uploaded.interface';
import { Page, paths } from '../../constants/routes';
import { StepService } from '../../services/step.service';
import { CounterpartyContractFormField } from '../../enums/counterparty-contract-form-field.enum';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { SimplebarAngularComponent } from 'simplebar-angular/lib/simplebar-angular.component';
import { StoreService } from 'src/app/services/store.service';
import { isFormValid } from 'src/app/utils';
import { CounterpartyContractFormService } from './counterparty-contract-form.service';
import { takeUntilDestroyed } from '@psb/angular-tools';

const docPreviewSrc = require('./doc-preview.png').default;

@Component({
    selector: 'counterparty-contract',
    templateUrl: 'counterparty-contract.component.html',
    styleUrls: ['counterparty-contract.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterpartyContractComponent implements OnInit {
    files$ = this.fileUploadService.files$;
    errorMessage$ = this.fileUploadService.errorMessage$;
    form = this.formService.createForm();
    ndsList = NDS_LIST;
    ButtonType = ButtonType;
    maxContractDate = new Date();
    selectedNds = 20;
    CounterpartyContractFormField = CounterpartyContractFormField;
    docPreviewSrc = docPreviewSrc;

    constructor(
        private store: StoreService,
        private fileUploadService: FileUploadService,
        private router: Router,
        private stepService: StepService,
        private formService: CounterpartyContractFormService,
    ) { }

    ngOnInit(): void {
        this.form.patchValue(this.store.letterOfCredit);

        this.subscribeOnFormFieldsChanges();
    }

    private subscribeOnFormFieldsChanges(): void {
        merge(
            this.formService.selectedNdsControl.valueChanges.pipe(
                tap((title: string) => {
                    const selectedNds = this.ndsList.find(
                        (ndsItem: SelectedItem) => ndsItem.label === title,
                    );
                    this.selectedNds = selectedNds?.value;
                    this.store.letterOfCredit.nds = selectedNds?.value;
                }),
            ),
            this.formService.contractDateControl.valueChanges.pipe(
                tap((contractDate: Date) => {
                    this.store.letterOfCredit.contractDate = this.formService.contractDateControl.valid
                        ? contractDate
                        : null;
                }),
            ),
            this.formService.contractControl.valueChanges.pipe(
                tap((contract: string) => {
                    this.store.letterOfCredit.contract = this.formService.contractControl.valid
                        ? contract
                        : '';
                }),
            ),
            this.formService.contractInfoControl.valueChanges.pipe<string>(
                tap((contractInfo: string) => {
                    this.store.letterOfCredit.contractInfo = this.formService.contractInfoControl.valid
                        ? contractInfo
                        : '';
                }),
            ),
        ).pipe(
            takeUntilDestroyed(this),
        ).subscribe();
    }

    setVat(): void {
        if (this.selectedNds === 0) {
            this.formService.selectedNdsControl.setValue(
                this.ndsList[this.ndsList.length - 1].label,
            );
        }
    }

    unsetVat(): void {
        if (this.selectedNds > 0) {
            this.formService.selectedNdsControl.setValue(
                this.ndsList[0].label,
            );
        }
    }

    wheelScroll(event: any, el: SimplebarAngularComponent): void {
        event.preventDefault();
        el.SimpleBar.getScrollElement().scrollLeft += event.deltaY;
    }

    handleSelectFiles(event: NgxDropzoneChangeEvent): void {
        this.fileUploadService.selectFiles(event);
    }

    handleRemoveFile(file: FileUploaded): void {
        this.fileUploadService.removeFile(file);
    }

    handleSubmit(): void {
        if (isFormValid(this.form)) {
            const date = this.formService.contractDateControl.value.toLocaleDateString(
                ruLocaleDateConfig.locale,
                ruLocaleDateConfig.config
            );

            const stepDescription = `№${this.store.letterOfCredit.contract} до ${date}`;

            this.stepService.setStepDescription(
                paths[Page.COUNTERPARTY_CONTRACT],
                stepDescription,
            );
            this.router.navigateByUrl(paths[Page.ACCREDITATION_PERIOD]);
        }
    }
}
