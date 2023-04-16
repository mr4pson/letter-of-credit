import { ChangeDetectionStrategy, Component } from "@angular/core";
import { UntilDestroy } from "@psb/angular-tools";

@Component({
    selector: 'loc-app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy()
export class AppComponent {
    constructor() { }
}
