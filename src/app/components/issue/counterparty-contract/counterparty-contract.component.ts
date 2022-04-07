import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ButtonType } from '@psb/fe-ui-kit/src/components/button';
import { SelectedItem } from '@psb/fe-ui-kit/src/components/input-select';
import { getRequiredFormControlValidator } from '@psb/validations/required';
import { SimplebarAngularComponent } from 'simplebar-angular/lib/simplebar-angular.component';
import { FormatHelper } from 'src/app/classes/format-helper';
import { FileUploaded } from 'src/app/models/file-upload.model';
import { LetterOfCredit } from 'src/app/models/letter-of-credit.model';

@Component({
  selector: 'counterparty-contract',
  templateUrl: 'counterparty-contract.component.html',
  styleUrls: ['counterparty-contract.component.scss'],
})
export class CounterpartyContractComponent implements OnInit {
  public issue3Group = new FormGroup({
    ContractDate: new FormControl('', [
      getRequiredFormControlValidator('Укажите дату заключения договора'),
    ]),
    SelectedNds: new FormControl(),
    Contract: new FormControl('', [
      getRequiredFormControlValidator(
        'Укажите название и номер договора',
      ),
    ]),
    ContractInfo: new FormControl('', [
      getRequiredFormControlValidator('Укажите предмет договора'),
    ]),
  });

  public ndsList: SelectedItem[] = [];

  public ButtonType = ButtonType;
  public errorMessage = '';
  public maxContractDate = new Date();
  public selectedNds = 20;

  public files: FileUploaded[] = [];
  private extensions = ['tiff', 'pdf', 'xml', 'doc', 'docx', 'xls', 'xlsx'];

  @Input() locInstance: LetterOfCredit;

  ngOnInit(): void {
    this.initNdsList();

    if (!this.locInstance) {
      return;
    }

    this.issue3Group.get('SelectedNds')?.valueChanges.subscribe(() => {
      const title = this.issue3Group.controls.SelectedNds.value;
      this.selectedNds = this.ndsList.find(
        (el: SelectedItem) => el.label === title,
      )?.value;
    });

    this.issue3Group.get('ContractDate')?.valueChanges.subscribe(() => {
      this.locInstance.contractDate = this.issue3Group.controls.ContractDate.valid
        ? this.issue3Group.controls.ContractDate.value
        : '';
    });

    this.issue3Group.get('Contract')?.valueChanges.subscribe(() => {
      this.locInstance.contract = this.issue3Group.controls.Contract.valid
        ? this.issue3Group.controls.Contract.value
        : '';
    });

    this.issue3Group.get('ContractInfo')?.valueChanges.subscribe(() => {
      this.locInstance.contractInfo = this.issue3Group.controls.ContractInfo.valid
        ? this.issue3Group.controls.ContractInfo.value
        : '';
    });

    this.issue3Group.controls.ContractDate.setValue(
      this.locInstance.contractDate,
    );
    this.issue3Group.controls.Contract.setValue(this.locInstance.contract);
    this.issue3Group.controls.ContractInfo.setValue(
      this.locInstance.contractInfo,
    );
  }

  public get ContractValue() {
    return this.issue3Group.controls.Contract.value;
  }

  public isValid(): boolean {
    this.issue3Group.controls.ContractDate.setValue(
      this.issue3Group.controls.ContractDate.value,
    );

    this.issue3Group.controls.ContractDate.markAsTouched();
    this.issue3Group.controls.Contract.markAsTouched();
    this.issue3Group.controls.ContractInfo.markAsTouched();

    return (
      this.issue3Group.controls.ContractDate.valid &&
      this.issue3Group.controls.Contract.valid &&
      this.issue3Group.controls.ContractInfo.valid
    );
  }

  public onSelectFile(event: any) {
    let rejectedFiles = 0;

    // tslint:disable-next-line: forin
    for (const index in event.addedFiles) {
      const file: File = event.addedFiles[index];
      const extension = file.name.split('.').pop().toLowerCase();
      if (this.extensions.indexOf(extension) < 0) {
        rejectedFiles += 1;
        continue;
      }

      if (
        this.files.find(
          f =>
            f.native.name === file.name && f.native.size === file.size,
          )
      ) {
        this.setErrorMessage(`Файл "${file.name}" уже загружен.`);
        continue;
      }

      const instance = new FileUploaded();
      instance.native = file;
      instance.sizeFormatted = FormatHelper.getSizeFormatted(
        instance.native.size,
      );

      this.files.push(instance);
    }

    if (rejectedFiles > 0) {
      this.setErrorMessage('Не все загруженные файлы подходящего типа.');
    }
  }

  public onRemoveFile(event: FileUploaded) {
    if (
      confirm(
        `Удалить документ "${event.native.name}" из списка загруженных?`,
      )
    ) {
      this.files.splice(this.files.indexOf(event), 1);
    }
  }

  public setVat() {
    if (this.selectedNds === 0) {
      this.selectedNds = 20;
      this.issue3Group.controls.SelectedNds.setValue(
        this.ndsList[this.ndsList.length - 1].label,
      );
    }
  }

  public unSetVat() {
    if (this.selectedNds > 0) {
      this.selectedNds = 0;
      this.issue3Group.controls.SelectedNds.setValue(
        this.ndsList[0].label,
      );
    }
  }

  public wheelScroll(event: any, el: SimplebarAngularComponent) {
    event.preventDefault();
    el.SimpleBar.getScrollElement().scrollLeft += event.deltaY;
  }

  private setErrorMessage(message: string) {
    this.errorMessage = message;

    setTimeout(() => {
      this.errorMessage = '';
    },         15000);
  }

  private initNdsList() {
    this.ndsList.push({ id: 1, label: '0%', value: 0 });
    this.ndsList.push({ id: 2, label: '10%', value: 10 });
    this.ndsList.push({ id: 3, label: '20%', value: 20 });
    this.issue3Group.controls.SelectedNds.setValue(
      this.ndsList[this.ndsList.length - 1].label,
    );
  }
}
