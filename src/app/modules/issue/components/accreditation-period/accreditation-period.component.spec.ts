import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import '@angular/common/locales/global/ru';
import { Router } from '@angular/router';

import { AccreditationPeriodComponent } from './accreditation-period.component';
import { StepService } from '../../services/step.service';
import { ClosingDocComponent } from './closing-doc/closing-doc.component';
import { Page, paths } from '../../constants/routes';
import { AccreditationPeriodFormField } from '../../enums/accreditation-period-form-field.enum';
import { AccreditationPeriodFormService } from './accreditation-period-form.service';
import { clickAddDocBtn, clickRemoveBtn, clickSubmitButton, getClosingDocs } from './testing';

import { StoreService } from 'src/app/services';
import { PsbModule } from 'src/app/modules/psb/psb.module';
import { isFormValid } from 'src/app/utils';

describe('AccreditationPeriodComponent', () => {
    let component: AccreditationPeriodComponent;
    let fixture: ComponentFixture<AccreditationPeriodComponent>;
    let router: Router;

    const initialFormValue = {
        endLocDate: new Date('06/05/2022'),
        locDaysNumber: '23',
        closingDocs: [
            {
                additionalRequirements: 'test req',
                amount: '1',
                document: 'test doc',
                onlyOriginalDocument: true,
            },
        ],
        isDocumentDigital: true,
        allowUsePartOfLoc: false,
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ClosingDocComponent,
                AccreditationPeriodComponent,
            ],
            imports: [
                CommonModule,
                PsbModule,
                ReactiveFormsModule,
                RouterTestingModule,
            ],
            providers: [
                StoreService,
                StepService,
                AccreditationPeriodFormService,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccreditationPeriodComponent);
        component = fixture.componentInstance;
        component.currentDate = new Date('5/13/2022');
        component.closingDocsControl.controls = [];
        component.form.reset();
        component.closingDocsControl.patchValue([]);
        router = TestBed.inject(Router);

        fixture.detectChanges();
    });

    it('При клике на кнопку добавить добавляет закрывающий документ', () => {
        clickAddDocBtn(fixture);

        const closingDocs = getClosingDocs(fixture);

        expect(closingDocs.nativeElement.children.length).toEqual(1);
    });

    it('При клике на кнопку удалить удаляет закрывающий документ', () => {
        clickAddDocBtn(fixture);

        const closingDocs = getClosingDocs(fixture);
        clickRemoveBtn(closingDocs, fixture);

        expect(closingDocs.nativeElement.children.length).toEqual(0);
    });

    it('При задании даты окончания аккредитива как 12/20/2022 срок действия аккредитива в днях до 221', () => {
        component.form.controls[AccreditationPeriodFormField.EndLocDate].patchValue(new Date('12/20/2022'));
        fixture.detectChanges();

        expect(component.form.controls[AccreditationPeriodFormField.LocDaysNumber].value).toEqual('221');
    });

    it('При задании срока действия аккредитива в днях как 221 задает дату окончания аккредитива как 12/20/2022', () => {
        component.form.controls[AccreditationPeriodFormField.LocDaysNumber].patchValue('221');
        fixture.detectChanges();

        expect(component.form.controls[AccreditationPeriodFormField.EndLocDate].value).toEqual(new Date('12/20/2022'));
    });

    it('При patchValue форма принимает аналогичное значение заданному', () => {
        initialFormValue.closingDocs.forEach(() => {
            component.addClosingDoc();
        });
        component.form.patchValue(initialFormValue);
        fixture.detectChanges();

        expect(component.form.value).toEqual(initialFormValue);
    });

    it('Вызывает handleSubmit при сабмите формы', () => {
        spyOn(component, 'handleSubmit');
        clickSubmitButton(fixture);

        expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('Редиректит к маршруту send appliation при валидной форме', () => {
        component.form.patchValue(initialFormValue);

        spyOn(router, 'navigateByUrl');
        clickSubmitButton(fixture);

        expect(isFormValid(component.form)).toBeTruthy();
        expect(router.navigateByUrl).toHaveBeenCalledWith(paths[Page.SEND_APPLICATION]);
    });
});
