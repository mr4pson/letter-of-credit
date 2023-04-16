import { registerLocaleData } from '@angular/common';
import ru from '@angular/common/locales/ru';
import { ApplicationRef, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';

import { AppComponent } from './app.component';
import { LetterOfCreditModule } from '@psb/letter-of-credit';

registerLocaleData(ru);
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        LetterOfCreditModule,
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(private appRef: ApplicationRef) { }
    hmrOnInit(store) {
        if (!store || !store.state) return;
        if ('restoreInputValues' in store) {
            store.restoreInputValues();
        }
        // change detection
        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }
    hmrOnDestroy(store) {
        const cmpLocation = this.appRef.components.map(
            cmp => cmp.location.nativeElement,
        );
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        store.restoreInputValues = createInputTransfer();
        removeNgStyles();
    }
    hmrAfterDestroy(store) {
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}
