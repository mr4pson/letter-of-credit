import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Router } from '@angular/router';

import { NDS_LIST } from '../../constants/constants';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploaded } from '../../interfaces/file-uploaded.interface';
import { Page, paths } from '../../constants/routes';
import { StepService } from '../../services/step.service';
import { CounterpartyContractFormField } from '../../enums/counterparty-contract-form-field.enum';
import { SET_AGREEMENT_NUMBER_CONTROL_MESSAGE, SET_AGREEMEN_SUBJECT_CONTROL_MESSAGE, SET_DATE_CONTROL_MESSAGE } from './constants';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { SimplebarAngularComponent } from 'simplebar-angular/lib/simplebar-angular.component';
import { StoreService } from 'src/app/services/store.service';
import { isFormValid } from 'src/app/utils';

@Component({
  selector: 'counterparty-contract',
  templateUrl: 'counterparty-contract.component.html',
  styleUrls: ['counterparty-contract.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterpartyContractComponent extends OnDestroyMixin implements OnInit {
  files$ = this.fileUploadService.files$;
  errorMessage$ = this.fileUploadService.errorMessage$;
  form: FormGroup;
  ndsList = NDS_LIST;
  ButtonType = ButtonType;
  maxContractDate = new Date();
  selectedNds = 20;
  CounterpartyContractFormField = CounterpartyContractFormField;

  private get contractDateControl() {
    return this.form.controls.contractDate;
  }

  private get selectedNdsControl() {
    return this.form.controls.selectedNds;
  }

  private get contractControl() {
    return this.form.controls.contract;
  }

  private get contractInfoControl() {
    return this.form.controls.contractInfo;
  }

  constructor(
    private store: StoreService,
    private fileUploadService: FileUploadService,
    private router: Router,
    private stepService: StepService,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.createForm();
  }

  ngOnInit(): void {
    this.form.patchValue(this.store.letterOfCredit);

    merge(
      this.selectedNdsControl.valueChanges.pipe(
        tap((title: string) => {
          const selectedNds = this.ndsList.find(
            (ndsItem: SelectedItem) => ndsItem.label === title,
          );
          this.selectedNds = selectedNds?.value;
        }),
      ),
      this.contractDateControl.valueChanges.pipe(
        tap((contractDate: Date) => {
          this.store.letterOfCredit.contractDate = this.contractDateControl.valid
            ? contractDate
            : null;
        }),
      ),
      this.contractControl.valueChanges.pipe(
        tap((contract: string) => {
          this.store.letterOfCredit.contract = this.contractControl.valid
            ? contract
            : '';
        }),
      ),
      this.contractInfoControl.valueChanges.pipe<string>(
        tap((contractInfo: string) => {
          this.store.letterOfCredit.contractInfo = this.contractInfoControl.valid
            ? contractInfo
            : '';
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();
  }

  setVat(): void {
    if (this.selectedNds === 0) {
      this.selectedNdsControl.setValue(
        this.ndsList[this.ndsList.length - 1].label,
      );
    }
  }

  unsetVat(): void {
    if (this.selectedNds > 0) {
      this.selectedNdsControl.setValue(
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
      const stepDescription = this.contractDateControl.value.toLocaleDateString(
        'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' },
      );

      this.stepService.setStepDescription(
        paths[Page.COUNTERPARTY_CONTRACT],
        stepDescription,
      );
      this.router.navigateByUrl(paths[Page.ACCREDITATION_PERIOD]);
    }
  }
    
  private createForm(): void {
    this.form = this.formBuilder.group({
      contractDate: ['', [
          getRequiredFormControlValidator(SET_DATE_CONTROL_MESSAGE),
        ]
      ],
      selectedNds: [NDS_LIST[2].label],
      contract: ['', [
          getRequiredFormControlValidator(SET_AGREEMENT_NUMBER_CONTROL_MESSAGE),
        ]
      ],
      contractInfo: ['', [
          getRequiredFormControlValidator(SET_AGREEMEN_SUBJECT_CONTROL_MESSAGE),
        ]
      ],
    });
  }
}
