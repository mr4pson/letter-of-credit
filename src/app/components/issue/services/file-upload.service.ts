import { Injectable } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FILE_EXTENSIONS } from '../constants/constants';
import { getFileSizeFormatted } from '../helpers/file-format.helper';

import { FileUploaded } from 'src/app/components/issue/interfaces/file-uploaded.interface';


@Injectable()
export class FileUploadService {
  private errorMessage$$ = new BehaviorSubject<string>('');
  public errorMessage$ = this.errorMessage$$.asObservable().pipe(
    tap((errorMessage) => {
      if (errorMessage) {
        setTimeout(this.clearErrorMessage.bind(this), 1000);
      }
    }),
  );

  private get errorMessage() {
    return this.errorMessage$$.getValue();
  }

  private set errorMessage(message: string) {
    this.errorMessage$$.next(message);
  }

  private files$$ = new BehaviorSubject<FileUploaded[]>([]);
  public files$ = this.files$$.asObservable();

  get files() {
    return this.files$$.getValue();
  }

  set files(files: FileUploaded[]) {
    this.files$$.next(files);
  }

  public selectFiles(event: NgxDropzoneChangeEvent): void {
    let rejectedFiles = 0;

    event.addedFiles.forEach((addedFile) => {
      const extension = addedFile.name.split('.').pop().toLowerCase();

      if (!FILE_EXTENSIONS.includes(extension)) {
        rejectedFiles += 1;

        return;
      }

      if (this.isFileAdded(addedFile)) {
        this.setErrorMessage(`Файл "${addedFile.name}" уже загружен.`);

        return;
      }

      const fileUploaded = {
        native: addedFile,
        sizeFormatted: getFileSizeFormatted(
          addedFile.size,
        ),
      } as FileUploaded;


      this.addFile(fileUploaded);
    });

    if (rejectedFiles > 0) {
      this.setErrorMessage('Не все загруженные файлы подходящего типа.');
    }
  }

  public handleFileRemoval(file: FileUploaded): void {
    if (
      confirm(
        `Удалить документ "${file.native.name}" из списка загруженных?`,
      )
    ) {
      this.removeFile(file);
    }
  }

  private addFile(file: FileUploaded): void {
    this.files = this.files.concat(file);
  }

  private removeFile(file: FileUploaded): void {
    this.files.splice(this.files.indexOf(file), 1);
  }

  private isFileAdded(addedFile: File): boolean {
    return !!this.files.find(
      file => file.native.name === addedFile.name && file.native.size === addedFile.size,
    );
  }

  private setErrorMessage(message: string): void {
    this.errorMessage = message;
  }

  private clearErrorMessage(): void {
    this.setErrorMessage('');
  }
}
