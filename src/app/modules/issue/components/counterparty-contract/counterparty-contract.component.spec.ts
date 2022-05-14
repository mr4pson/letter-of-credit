import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';

import { StepService } from '../../services/step.service';
import { Page, paths } from '../../constants/routes';
import { CounterpartyContractComponent } from './counterparty-contract.component';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploaded } from '../../interfaces/file-uploaded.interface';
import { NDS_LIST } from '../../constants/constants';

import { PsbModule } from 'src/app/modules/psb/psb.module';
import { UiKitModule } from 'src/app/modules/ui-kit/ui-kit.module';
import { StoreService } from 'src/app/services';
import { SimplebarAngularModule } from 'simplebar-angular';

describe('CounterpartyContractComponent', () => {
  let component: CounterpartyContractComponent;
  let fixture: ComponentFixture<CounterpartyContractComponent>;
  let router: Router;
  let fileUploadService: FileUploadService;

  const files$$ = new BehaviorSubject([]);
  const errorMessage$$ = new BehaviorSubject([]);

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
        {
          provide: FileUploadService,
          clients: {
            files$: files$$.asObservable(),
            errorMessage$: errorMessage$$.asObservable(),
            selectFiles: (event: NgxDropzoneChangeEvent) => {},
            removeFile: (file: FileUploaded) => {},
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial form value', () => {
    const initialForm = {
      contractDate: new Date('02/02/2022'),
      selectedNds: NDS_LIST[2].label,
      contract: 'test contract',
      contractInfo: 'test contractInfo',
    };
    component.form.patchValue(initialForm);

    expect(initialForm).toEqual(component.form.value);
  });

  it('should call fileUpload selectFiles on handleSelectFiles call', () => {
    const file = new File([], 'test file.png');
    const seletFilesEvent = {
      addedFiles: [file],
      rejectedFiles: [],
    } as NgxDropzoneChangeEvent;

    spyOn(fileUploadService, 'selectFiles');
    component.handleSelectFiles(seletFilesEvent);

    expect(fileUploadService.selectFiles).toHaveBeenCalledWith(seletFilesEvent);
  });

  it('should call fileUpload removeFile on handleRemoveFile call', () => {
    const file = new File([], 'test file.png');
    const fileUploaded = {
      native: file,
      sizeFormatted: '',
    } as FileUploaded;

    spyOn(fileUploadService, 'removeFile');
    component.handleRemoveFile(fileUploaded);

    expect(fileUploadService.removeFile).toHaveBeenCalledWith(fileUploaded);
  });

  it('should call setVat on button click', () => {
    spyOn(component, 'setVat');
    const vatBtn = fixture.debugElement.query(
      By.css('.counterparty-contract__nds-actions psb-button:first-child button'),
    );
    vatBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.setVat).toHaveBeenCalled();
  });

  it('should call unsetVat on button click', () => {
    spyOn(component, 'unsetVat');
    const vatBtn = fixture.debugElement.query(
      By.css('.counterparty-contract__nds-actions psb-button:last-child button'),
    );
    vatBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.unsetVat).toHaveBeenCalled();
  });

  it('should call handleSubmit on button click', () => {
    spyOn(component, 'handleSubmit');
    const submitButton = fixture.debugElement.query(By.css('.counterparty-contract__submit button'));
    submitButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('should navigate to counterparty on valid form submit click', () => {
    const initialForm = {
      contractDate: new Date(),
      selectedNds: NDS_LIST[2].label,
      contract: 'test contract',
      contractInfo: 'test contractInfo',
    };
    component.form.patchValue(initialForm);

    spyOn(router, 'navigateByUrl');
    const submitButton = fixture.debugElement.query(By.css('.counterparty-contract__submit button'));
    submitButton.nativeElement.click();

    expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.ACCREDITATION_PERIOD]);
  });
});
