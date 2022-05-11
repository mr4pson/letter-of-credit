import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PsbModule } from '../psb/psb.module';
import { AccountSelectComponent } from './components/account-select/account-select.component';
import { NotificationModule } from './components/notification/notification.module';

import { ClickOutsideModule } from '@psb/angular-tools';

@NgModule({
  declarations: [
    AccountSelectComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ClickOutsideModule,
    CommonModule,
    NotificationModule,
    PsbModule,
  ],
  exports: [
    AccountSelectComponent,
    NotificationModule,
  ],
})
export class UiKitModule { }
