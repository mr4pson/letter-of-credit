import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreService} from './state.service';
import {AccountService} from "./account.service";
import {ClientAccountsService} from "./client-accounts.service";
import {PartnersService} from "./partners.service";

@NgModule({
	declarations: [],
	imports: [
		CommonModule
	],
	providers: [
		StoreService,
		AccountService,
		ClientAccountsService,
		PartnersService,
	]
})
export class ModelsModule { }
