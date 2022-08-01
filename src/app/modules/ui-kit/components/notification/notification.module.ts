import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NotificationService } from './notification.service';
import { NotificationComponent } from './notification.component';

import { PsbModule } from 'src/app/modules/psb/psb.module';

@NgModule({
    declarations: [
        NotificationComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        PsbModule,
    ],
    providers: [
        NotificationService,
    ],
    exports: [
        NotificationComponent,
    ],
})
export class NotificationModule { }
