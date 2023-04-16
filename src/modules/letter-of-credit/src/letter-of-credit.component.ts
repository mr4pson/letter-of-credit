import { ChangeDetectionStrategy, Component } from "@angular/core";
import { StoreService } from "./services";

@Component({
    selector: 'loc-letter-of-credit.component',
    templateUrl: './letter-of-credit.component.html',
    styleUrls: ['./letter-of-credit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LetterOfCreditComponent {
    isIssueVissible$ = this.store.isIssueVissible$;

    constructor(private store: StoreService) { }
}