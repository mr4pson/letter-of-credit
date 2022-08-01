import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccreditationAmountComponent } from './components/accreditation-amount/accreditation-amount.component';
import { AccreditationPeriodComponent } from './components/accreditation-period/accreditation-period.component';
import { CounterpartyContractComponent } from './components/counterparty-contract/counterparty-contract.component';
import { СounterpartyComponent } from './components/counterparty/counterparty.component';
import { SendApplicationComponent } from './components/send-application/send-application.component';
import { Page, paths } from './constants/routes';

export const routes: Routes = [
    { path: '', redirectTo: paths[Page.ACCREDITATION_AMOUNT], pathMatch: 'full' },
    { path: paths[Page.ACCREDITATION_AMOUNT], component: AccreditationAmountComponent },
    { path: paths[Page.COUNTERPARTY], component: СounterpartyComponent },
    { path: paths[Page.COUNTERPARTY_CONTRACT], component: CounterpartyContractComponent },
    { path: paths[Page.ACCREDITATION_PERIOD], component: AccreditationPeriodComponent },
    { path: paths[Page.SEND_APPLICATION], component: SendApplicationComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled' })],
    exports: [RouterModule],
})
export class IssueRoutingModule { }
