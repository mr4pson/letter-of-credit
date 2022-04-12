import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreService } from './state.service';
import { AccountService } from '../services/account.service';
import { ClientAccountService } from '../components/issue/services/client-accounts.service';
import { PartnersService } from './partners.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    StoreService,
    AccountService,
    ClientAccountService,
    PartnersService,
  ],
})
export class ModelsModule { }
