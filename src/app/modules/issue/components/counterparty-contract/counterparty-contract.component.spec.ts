import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';

import { StepService } from '../../services/step.service';
import { Page, paths } from '../../constants/routes';
import { CounterpartyContractComponent } from './counterparty-contract.component';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploaded } from '../../interfaces/file-uploaded.interface';
import { NDS_LIST } from '../../constants/constants';
import { CounterpartyContractFormService } from './counterparty-contract-form.service';
import { clickNoVatBtn, clickSubmitButton, clickVatBtn } from './testing.utils';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { UiKitModule } from 'src/app/modules/ui-kit/ui-kit.module';
import { StoreService } from 'src/app/services';
import { SimplebarAngularModule } from 'simplebar-angular';
import { isFormValid } from 'src/app/utils';

describe('CounterpartyContractComponent', () => {
    let component: CounterpartyContractComponent;
    let fixture: ComponentFixture<CounterpartyContractComponent>;
    let router: Router;
    let fileUploadService: FileUploadService;

    const files$$ = new BehaviorSubject([]);
    const errorMessage$$ = new BehaviorSubject([]);

    const initialForm = {
        contractDate: new Date('02/02/2022'),
        selectedNds: NDS_LIST[2].label,
        contract: 'test contract',
        contractInfo: 'test contractInfo',
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                CounterpartyContractComponent,
            ],
            imports: [
                CommonModule,
                PsbModule,
                NgxDropzoneModule,
                SimplebarAngularModule,
                ReactiveFormsModule,
                RouterTestingModule,
                UiKitModule,
            ],
            providers: [
                StoreService,
                StepService,
                CounterpartyContractFormService,
                {
                    provide: FileUploadService,
                    clients: {
                        files$: files$$.asObservable(),
                        errorMessage$: errorMessage$$.asObservable(),
                        selectFiles: (event: NgxDropzoneChangeEvent) => { },
                        removeFile: (file: FileUploaded) => { },
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CounterpartyContractComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        fileUploadService = TestBed.inject(FileUploadService);

        component.form.reset();
        fixture.detectChanges();
    });

    it('При patchValue форма принимает аналогичное значение заданному', () => {
        component.form.patchValue(initialForm);

        expect(initialForm).toEqual(component.form.value);
    });

    it('Вызывает selectFiles в fileUploadService при вызове handleSelectFiles', () => {
        const file = new File([], 'test file.png');
        const seletFilesEvent = {
            addedFiles: [file],
            rejectedFiles: [],
        } as NgxDropzoneChangeEvent;

        spyOn(fileUploadService, 'selectFiles');
        component.handleSelectFiles(seletFilesEvent);

        expect(fileUploadService.selectFiles).toHaveBeenCalledWith(seletFilesEvent);
    });

    it('Вызывает removeFile в fileUploadService при вызове handleRemoveFile', () => {
        const file = new File([], 'test file.png');
        const fileUploaded = {
            native: file,
            sizeFormatted: '',
        } as FileUploaded;

        spyOn(fileUploadService, 'removeFile');
        component.handleRemoveFile(fileUploaded);

        expect(fileUploadService.removeFile).toHaveBeenCalledWith(fileUploaded);
    });

    it('Вызывает setVat при клике на кнопку "НДС включён"', () => {
        spyOn(component, 'setVat');
        clickVatBtn(fixture);

        expect(component.setVat).toHaveBeenCalled();
    });

    it('Вызывает unsetVat при клике на кнопку "Без НДС"', () => {
        spyOn(component, 'unsetVat');
        clickNoVatBtn(fixture);
        fixture.detectChanges();

        expect(component.unsetVat).toHaveBeenCalled();
    });

    it('Вызывает handleSubmit при сабмите формы', () => {
        spyOn(component, 'handleSubmit');
        clickSubmitButton(fixture);

        expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('Редиректит к маршруту accreditation period при валидной форме', () => {
        component.form.patchValue(initialForm);

        spyOn(router, 'navigateByUrl');
        clickSubmitButton(fixture);

        expect(isFormValid(component.form)).toBeTruthy();
        expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.ACCREDITATION_PERIOD]);
    });
});
