import {Component, Input} from '@angular/core';
import {StoreService} from "src/app/models/state.service";

@Component({
	selector: "loc-issue-steps",
	templateUrl: "issue-steps.component.html",
	styleUrls: ["issue-steps.component.scss"]
})
export class IssueStepsComponent {
	@Input() public CurrentStep = 1;

	public constructor(
		public Store: StoreService,
	) { }
}
