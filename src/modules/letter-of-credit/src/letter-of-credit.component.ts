import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UntilDestroy } from "@psb/angular-tools";
import { StoreService } from "./services";

@Component({
    selector: 'loc-letter-of-credit',
    templateUrl: './letter-of-credit.component.html',
    styleUrls: ['./letter-of-credit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class LetterOfCreditComponent {
    isIssueVissible$ = this.store.isIssueVissible$;

    constructor(
        private store: StoreService,
    ) { }
}