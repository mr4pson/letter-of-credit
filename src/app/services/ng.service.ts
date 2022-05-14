import { Inject, Injectable, Optional, Renderer2 } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import {
  Ng,
  SmbAccountSectionComponent,
  SmbAppComponent,
  SmbComponentInterface,
  SmbDocumentFilterComponent,
  SmbDocumentsComponent,
  SmbPaymentFormComponent,
  SmbReceiverAutocompleteComponent,
  SmbSavePublishBlockComponent,
} from '../interfaces';
import { ErrorHandlerService } from './error-handler.service';
import { SmbSelector } from '../enums/smb-selector.enum';


@Injectable()
export class NgService {
  private instance: Ng;
  private ngDevMode: boolean;
  private renderer: Renderer2;
  private window = this.document.defaultView;

  constructor(
    @Optional() @Inject(DOCUMENT) private document,
    private errorHandler: ErrorHandlerService,
  ) {
    this.instance = this.window.ng;
    this.ngDevMode = !!this.window.ngDevMode;
    if (!this.ngDevMode) {
      throw Error('Приложение в режиме prod. Ng сущность не инициализирована');
    }
  }

  getSmbAppComponent(): SmbAppComponent {
    return this.getComponent<SmbAppComponent>(SmbSelector.App);
  }

  getSmbPaymentFormComponent(): SmbPaymentFormComponent {
    return this.getComponent<SmbPaymentFormComponent>(SmbSelector.RublePaymentForm);
  }

  getSmbAccountSectionComponent(): SmbAccountSectionComponent {
    return this.getComponent<SmbAccountSectionComponent>(SmbSelector.AccountSection);
  }

  getSmbDocumentsComponent(): SmbDocumentsComponent {
    return this.getComponent<SmbDocumentsComponent>(SmbSelector.Documents);
  }

  getSmbSavePublishBlockComponent(): SmbSavePublishBlockComponent {
    return this.getComponent<SmbSavePublishBlockComponent>(SmbSelector.SavePublishBlock);
  }

  getSmbDocumentsFilterComponent(): SmbDocumentFilterComponent {
    return this.getComponent<SmbDocumentFilterComponent>(SmbSelector.DocumentFilter);
  }

  getSmbReceiverAutocompleteComponent(): SmbReceiverAutocompleteComponent {
    return this.getComponent<SmbReceiverAutocompleteComponent>(SmbSelector.ReceiverAutocomplete);
  }

  getMainNewPaymentButtonElement(): HTMLElement {
    return this.renderer.selectRootElement(SmbSelector.MainNewPaymentButton, true);
  }

  getDocumentsNewPaymentButtonElement(): HTMLElement {
    return this.renderer.selectRootElement(SmbSelector.DocumentsNewPaymentButton, true);
  }

  getPaymentFormCloseElement(): HTMLElement {
    return this.renderer.selectRootElement(SmbSelector.PaymentFormCloseButton, true);
  }

  hideSmbDocuments() {
    this.renderer.selectRootElement(SmbSelector.Documents, true).classList.add('hidden');
  }

  showSmbDocuments() {
    this.renderer.selectRootElement(SmbSelector.Documents, true).classList.remove('hidden');
  }

  setRenderer(renderer: Renderer2): void {
    this.renderer = renderer;
  }

  private getComponent<T>(selector: string): T | null {
    let element: Element;

    try {
      element = this.renderer.selectRootElement(selector, true);
    } catch (error) {
      this.errorHandler.showErrorMessage(`Невозможно найти селектор ${selector} в DOM дереве`);
    }

    if (!element) {
      return null;
    }

    const component = this.instance.getComponent
      <T & Pick<SmbComponentInterface, 'destroyed$' | 'ngOnDestroy'>>(element);

    component.destroyed$ = new ReplaySubject(1);

    component.ngOnDestroy = () => {
      component.ngOnDestroy();
      component.destroyed$.next(true);
      component.destroyed$.complete();
    };

    return component;
  }
}
