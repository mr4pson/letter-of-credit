import { Inject, Injectable, Optional, Renderer2 } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { DOCUMENT } from "@angular/common";

import {
    Ng,
    SmbAccountComponent,
    SmbAppComponent,
    SmbComponentInterface,
    SmbDocumentFilterComponent,
    SmbDocumentsComponent,
    SmbPaymentFormComponent,
    SmbReceiverAutocompleteComponent,
    SmbSavePublishBlockComponent,
} from "../interfaces";
import { ErrorHandlerService } from "./error-handler.service";
import { SmbSelector } from "../enums/smb-selector.enum";

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
            throw Error("Приложение в режиме prod. Ng сущность не инициализирована");
        }
    }

    getSmbAppComponent(): SmbAppComponent {
        return this.getComponent<SmbAppComponent>(SmbSelector.App);
    }

    getSmbPaymentFormComponent(): SmbPaymentFormComponent {
        return this.getComponent<SmbPaymentFormComponent>(
            SmbSelector.RublePaymentForm,
        );
    }

    getSmbAccountComponent(): SmbAccountComponent {
        return this.getComponent<SmbAccountComponent>(SmbSelector.Account);
    }

    getSmbDocumentsComponent(): SmbDocumentsComponent {
        return this.getComponent<SmbDocumentsComponent>(SmbSelector.Documents);
    }

    getSmbSavePublishBlockComponent(): SmbSavePublishBlockComponent {
        return this.getComponent<SmbSavePublishBlockComponent>(
            SmbSelector.SavePublishBlock,
        );
    }

    getSmbDocumentsFilterComponent(): SmbDocumentFilterComponent {
        return this.getComponent<SmbDocumentFilterComponent>(
            SmbSelector.DocumentFilter,
        );
    }

    getSmbReceiverAutocompleteComponent(): SmbReceiverAutocompleteComponent {
        return this.getComponent<SmbReceiverAutocompleteComponent>(
            SmbSelector.ReceiverAutocomplete,
        );
    }

    getDocumentsNewPaymentButtonElement(): HTMLElement {
        return this.getRootElement(SmbSelector.DocumentsNewPaymentButton);
    }

    hideSmbDocuments() {
        const documents = this.getRootElement(SmbSelector.Documents);
        documents?.classList.add("hidden");
    }

    showSmbDocuments() {
        const documents = this.getRootElement(SmbSelector.Documents);
        documents?.classList.remove("hidden");
    }

    setRenderer(renderer: Renderer2): void {
        this.renderer = renderer;
    }

    scrollToTop(): void {
        this.window.scroll(0, 0);
    }

    private getRootElement(selector: string): HTMLElement | null {
        let element: HTMLElement;

        try {
            element = this.renderer.selectRootElement(selector, true);
        } catch (error) {
            this.errorHandler.showErrorMessage(
                `Невозможно найти селектор ${selector} в DOM дереве`
            );
        }

        return element;
    }

    private getComponent<T>(selector: string): T | null | undefined {
        const element = this.getRootElement(selector);

        if (!element) {
            return null;
        }

        const component = this.instance.getComponent<
            T & Pick<SmbComponentInterface, "destroyed$" | "ngOnDestroy">
        >(element);

        if (!component) {
            return undefined;
        }

        component.destroyed$ = new ReplaySubject(1);

        component.ngOnDestroy = () => {
            component.ngOnDestroy();
            component.destroyed$.next(true);
            component.destroyed$.complete();
        };

        return component;
    }
}
