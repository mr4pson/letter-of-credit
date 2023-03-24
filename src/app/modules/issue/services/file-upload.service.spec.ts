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

    it('Добавляет один файл в список файлов', () => {
        const file = new File([], 'testFile1.pdf');
        const seletFilesEvent = {
            addedFiles: [file],
            rejectedFiles: [],
        } as NgxDropzoneChangeEvent;

        service.selectFiles(seletFilesEvent);

        expect(service.files.length).toBe(seletFilesEvent.addedFiles.length);
    });

    it('Не добавляет файл с недопустимым расширением и задает сообщение об ошибке о недопустимых типах файлов', () => {
        const file = new File([], 'testFile1.jpg');
        const seletFilesEvent = {
            addedFiles: [file],
            rejectedFiles: [],
        } as NgxDropzoneChangeEvent;

        service.selectFiles(seletFilesEvent);

        expect(service.files.length).toBe(0);
        expect(service.errorMessage).toBe(FileError.NotSuitableTypes);
    });

    it('Не добавляет файл повторно с таким же именем и показывает ошибку, что файл уже был загружен', () => {
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

    it('Отчищает сообщение об ошибке через 1 секунду', fakeAsync(() => {
        const file = new File([], 'testFile1.pdf');
        const seletFilesEvent = {
            addedFiles: [file],
            rejectedFiles: [],
        } as NgxDropzoneChangeEvent;

        service.selectFiles(seletFilesEvent);
        service.errorMessage$.subscribe();
        tick(1000);

        expect(service.errorMessage).toBe('');
    }));

    it('Удаляет файл', fakeAsync(() => {
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
