import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

import { NDS_LIST } from '../constants/constants';
import { FileUploadService } from '../services/file-uploading.service';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { SimplebarAngularComponent } from 'simplebar-angular/lib/simplebar-angular.component';
import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';
import { FileUploaded } from 'src/app/components/issue/interfaces/file-uploaded.interface';
import { StoreService } from 'src/app/models/state.service';

@Component({
  selector: 'counterparty-contract',
  templateUrl: 'counterparty-contract.component.html',
  styleUrls: ['counterparty-contract.component.scss'],
})
export class CounterpartyContractComponent extends OnDestroyMixin implements OnInit {
  @Input() locInstance: LetterOfCredit;

  public files$ = this.fileUploadingService.files$;
  public errorMessage$ = this.fileUploadingService.errorMessage$;

  public form = new FormGroup({
    contractDate: new FormControl('', [
      getRequiredFormControlValidator('Укажите дату заключения договора'),
    ]),
    selectedNds: new FormControl(NDS_LIST[2].label),
    contract: new FormControl('', [
      getRequiredFormControlValidator('Укажите название и номер договора'),
    ]),
    contractInfo: new FormControl('', [
      getRequiredFormControlValidator('Укажите предмет договора'),
    ]),
  });

  public ndsList = NDS_LIST;
  public ButtonType = ButtonType;
  public maxContractDate = new Date();
  public selectedNds = 20;

  get contractDateControl() {
    return this.form.controls.contractDate;
  }

  get selectedNdsControl() {
    return this.form.controls.selectedNds;
  }

  get contractControl() {
    return this.form.controls.contract;
  }

  get contractInfoControl() {
    return this.form.controls.contractInfo;
  }

  constructor(
    private store: StoreService,
    private fileUploadingService: FileUploadService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.form.patchValue(this.locInstance);

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
          this.locInstance.contractDate = this.contractDateControl.valid
            ? contractDate
            : null;
        }),
      ),
      this.contractControl.valueChanges.pipe(
        tap((contract: string) => {
          this.locInstance.contract = this.contractControl.valid
            ? contract
            : '';
        }),
      ),
      this.contractInfoControl.valueChanges.pipe<string>(
        tap((contractInfo) => {
          this.locInstance.contractInfo = this.contractInfoControl.valid
            ? contractInfo
            : '';
        }),
      ),
    ).pipe(
      untilComponentDestroyed(this),
    ).subscribe();
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }

  public setVat() {
    if (this.selectedNds === 0) {
      this.selectedNdsControl.setValue(
        this.ndsList[this.ndsList.length - 1].label,
      );
    }
  }

  public unSetVat() {
    if (this.selectedNds > 0) {
      this.selectedNdsControl.setValue(
        this.ndsList[0].label,
      );
    }
  }

  public wheelScroll(event: any, el: SimplebarAngularComponent): void {
    event.preventDefault();
    el.SimpleBar.getScrollElement().scrollLeft += event.deltaY;
  }

  public handleSelectFiles(event: NgxDropzoneChangeEvent): void {
    this.fileUploadingService.selectFiles(event);
  }

  public handleRemoveFile(file: FileUploaded): void {
    this.fileUploadingService.handleFileRemoval(file);
  }

  public handleSubmit(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });

    if (this.isFormValid()) {
      this.store.issueStep3Text =  this.contractDateControl.value.contractDate.toLocaleDateString(
        'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' },
      );

      // this.currentStep = 4;
      console.log(this.form);
    }
  }
}