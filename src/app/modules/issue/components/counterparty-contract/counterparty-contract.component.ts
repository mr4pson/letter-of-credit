import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { OnDestroyMixin, untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { Router } from '@angular/router';

import { NDS_LIST } from '../../constants/constants';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploaded } from '../../interfaces/file-uploaded.interface';
import { Page, paths } from '../../constants/routes';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { SimplebarAngularComponent } from 'simplebar-angular/lib/simplebar-angular.component';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'counterparty-contract',
  templateUrl: 'counterparty-contract.component.html',
  styleUrls: ['counterparty-contract.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CounterpartyContractComponent extends OnDestroyMixin implements OnInit {
  public files$ = this.fileUploadService.files$;
  public errorMessage$ = this.fileUploadService.errorMessage$;

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
    private fileUploadService: FileUploadService,
    private router: Router,
  ) {
    super();
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
        tap((contractInfo) => {
          this.store.letterOfCredit.contractInfo = this.contractInfoControl.valid
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

  public setVat(): void {
    if (this.selectedNds === 0) {
      this.selectedNdsControl.setValue(
        this.ndsList[this.ndsList.length - 1].label,
      );
    }
  }

  public unSetVat(): void {
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
    this.fileUploadService.selectFiles(event);
  }

  public handleRemoveFile(file: FileUploaded): void {
    this.fileUploadService.handleFileRemoval(file);
  }

  public handleSubmit(): void {
    Object.values(this.form.controls).forEach((control) => {
      control.markAllAsTouched();
      control.updateValueAndValidity();
    });

    if (this.isFormValid()) {
      this.store.issueStep3Text = this.contractDateControl.value.toLocaleDateString(
        'ru-RU',
        { year: 'numeric', month: 'long', day: 'numeric' },
      );
      console.log(this.form.value);
      this.router.navigateByUrl(paths[Page.ACCREDITATION_PERIOD]);
    }
  }
}
