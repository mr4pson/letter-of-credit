import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { UntilDestroy } from "@psb/angular-tools";
import { LetterOfCreditService } from "@psb/letter-of-credit";
import { tap } from "rxjs/operators";

@Component({
    selector: 'loc-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class AppComponent implements OnInit {
    public showNewPayment = false;
    public newPaymentForm = new FormGroup({
        summa: new FormControl('', []),
        destination: new FormControl('', []),
        receiver: new FormGroup({
            inn: new FormControl('', []),
            name: new FormControl('', []),
            account: new FormControl('', []),
            kpp: new FormControl('', []),
            bik: new FormControl('', []),
            bankAccount: new FormControl('', []),
        }),
        account: new FormControl('', []),
    });

    constructor(
        private letterOfCreditService: LetterOfCreditService
    ) { }

    handleLetterOfCreditShow() {
        this.showNewPayment = false;
        this.letterOfCreditService.handleOpenIssue();
        // При клике скрыть страницу с документом .smb-content ng-component
    }

    handleNewPaymenyClick() {
        this.letterOfCreditService.handleCloseIssue();
        this.showNewPayment = true;
    }

    selectClient(client) {
        console.log(client);
    }

    handleAccountSelect(account) {
        console.log(account);
    }

    handleFormSend() {
        console.log('Form send');
    }

    ngOnInit(): void {
        this.letterOfCreditService.isIssueVissible$.pipe(
            tap((isIssueVissible) => {
                console.log(isIssueVissible);
                if (!isIssueVissible) {
                    console.log('При сокрытии letter of credit показать страницу с документом .smb-content ng-component');
                }
            }),
        ).subscribe();
    }
}
