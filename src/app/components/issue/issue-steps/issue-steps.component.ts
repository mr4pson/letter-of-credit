import { Component, Input } from "@angular/core";
import { Step } from "src/app/classes/interfaces/step.interface";
import { StoreService } from "src/app/models/state.service";

@Component({
	selector: "loc-issue-steps",
	templateUrl: "issue-steps.component.html",
	styleUrls: ["issue-steps.component.scss"],
})
export class IssueStepsComponent {
	@Input() public CurrentStep = 1;

	steps: Step[] = [
		{
			title: "Сумма аккредитива с комиссией",
			description: this.store.IssueStep1Text,
		},
		{
			title: "Контрагент",
			description: this.store.IssueStep2Text,
		},
		{
			title: "Договор с контрагентом",
			description: this.store.IssueStep3Text,
		},
		{
			title: "Срок действия аккредитива",
			description: this.store.IssueStep4Text,
		},
		{
			title: "Отправить заявку",
		},
	];

	public constructor(public store: StoreService) {}
}
