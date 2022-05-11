import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PsbModule } from '../psb/psb.module';
import { AccountSelectComponent } from './components/account-select/account-select.component';

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
    PsbModule,
  ],
  exports: [
    AccountSelectComponent,
  ],
})
export class UiKitModule { }
