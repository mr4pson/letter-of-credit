import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

import { FileError } from '../constants/constants';
import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  let service: FileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [FileUploadService],
    });
    service = TestBed.inject(FileUploadService);
  });

  it('should add file to the list', () => {
    const file = new File([], 'testFile1.pdf');
    const seletFilesEvent = {
      addedFiles: [file],
      rejectedFiles: [],
    } as NgxDropzoneChangeEvent;

    service.selectFiles(seletFilesEvent);

    expect(service.files.length).toBe(seletFilesEvent.addedFiles.length);
  });

  it('should not add file due to file extension and set error message if a file didn\'t load', () => {
    const file = new File([], 'testFile1.jpg');
    const seletFilesEvent = {
      addedFiles: [file],
      rejectedFiles: [],
    } as NgxDropzoneChangeEvent;

    service.selectFiles(seletFilesEvent);

    expect(service.files.length).toBe(0);
    expect(service.errorMessage).toBe(FileError.NotSuitableTypes);
  });

  it('should not load file with same fileName again and show file already loadded error message', () => {
    const file = new File([], 'testFile1.pdf');
    const seletFilesEvent = {
      addedFiles: [file],
      rejectedFiles: [],
    } as NgxDropzoneChangeEvent;

    service.selectFiles(seletFilesEvent);
    service.selectFiles(seletFilesEvent);

    expect(service.files.length).toBe(1);
    expect(service.errorMessage).toBe(`Файл "${file.name}" уже загружен.`);
  });

  it('should clear error message in 1 second', fakeAsync(() => {
    const file = new File([], 'testFile1.pdf');
    const seletFilesEvent = {
      addedFiles: [file],
      rejectedFiles: [],
    } as NgxDropzoneChangeEvent;

    service.selectFiles(seletFilesEvent);
    service.selectFiles(seletFilesEvent);
    service.errorMessage$.subscribe();
    tick(1000);

    expect(service.errorMessage).toBe('');
  }));

  it('should remove file', fakeAsync(() => {
    const file = new File([], 'testFile1.pdf');
    const seletFilesEvent = {
      addedFiles: [file],
      rejectedFiles: [],
    } as NgxDropzoneChangeEvent;

    service.selectFiles(seletFilesEvent);
    service.removeFile(service.files[0]);

    expect(service.files.length).toBe(0);
  }));
});
