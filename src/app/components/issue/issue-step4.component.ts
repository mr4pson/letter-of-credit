import {Component, Input, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup} from "@angular/forms";
import {getRequiredFormControlValidator} from "@psb/validations/required";
import {ClosingDoc} from "src/app/models/closing-doc.model";
import {LetterOfCredit} from "src/app/models/letter-of-credit.model";

@Component({
	selector: "loc-issue-step4",
	templateUrl: "issue-step4.component.html",
	styleUrls: ["issue-step4.component.scss"]
})
export class IssueStep4Component implements OnInit {
	public Issue4Group = new FormGroup({
		EndLocDate: new FormControl("", [
			getRequiredFormControlValidator("Укажите дату окончания аккредитива"),
		]),
		LocDaysLength: new FormControl(""),
		PerhapsDigitalDoc: new FormControl(true),
		AllowUsePartOfLoc: new FormControl(true),
		ClosingDoc: new FormArray([]),
	});

	public MinEndLocDate = new Date();

	@Input() LocInstance: LetterOfCredit;

	constructor() {
		this.MinEndLocDate.setDate(this.MinEndLocDate.getDate() + 1);
	}

	ngOnInit(): void {
		var that = this;
		this.Issue4Group.get("EndLocDate")?.valueChanges.subscribe(() => {
			if ("" === that.Issue4Group.controls.EndLocDate.value) {
				return;
			}

			that.LocInstance.EndLocDate = that.Issue4Group.controls.EndLocDate.valid ?
				that.Issue4Group.controls.EndLocDate.value : "";

			that.SetLocDays();
		});

		this.Issue4Group.get("LocDaysLength")?.valueChanges.subscribe(() => {
			let daysValue = that.Issue4Group.controls.LocDaysLength.value;
			if ("" === daysValue) {
				that.Issue4Group.controls.EndLocDate.setValue("");
				return;
			}

			let days: number = Number(daysValue);
			if (days < 1 || days > 365) {
				that.Issue4Group.controls.LocDaysLength.setValue("");
				return;
			}

			that.SetLocDate(days);
		});

		this.Issue4Group.get("PerhapsDigitalDoc")?.valueChanges.subscribe(() => {
			that.LocInstance.PerhapsDigitalDoc = this.Issue4Group.controls.PerhapsDigitalDoc.value;
		});

		this.Issue4Group.get("AllowUsePartOfLoc")?.valueChanges.subscribe(() => {
			that.LocInstance.AllowUsePartOfLoc = this.Issue4Group.controls.AllowUsePartOfLoc.value;
		});

		this.Issue4Group.controls.EndLocDate.setValue(this.LocInstance.EndLocDate);
		this.Issue4Group.controls.PerhapsDigitalDoc.setValue(that.LocInstance.PerhapsDigitalDoc);
		this.Issue4Group.controls.AllowUsePartOfLoc.setValue(that.LocInstance.AllowUsePartOfLoc);

		if (this.LocInstance.ClosingDocs.length > 0) {
			for (let index in this.LocInstance.ClosingDocs) {
				this.AddClosingDoc(this.LocInstance.ClosingDocs[index]);
			}
		} else {
			this.AddClosingDoc();
		}

		this.Issue4Group.get("ClosingDoc")?.valueChanges.subscribe(() => {
			that.LocInstance.ClosingDocs = [];
			for (let index in that.Issue4Group.controls.ClosingDoc.value) {
				let item: ClosingDoc = that.Issue4Group.controls.ClosingDoc.value[index];
				if ("" === item.Document.trim()) {
					continue;
				}
				let instance = new ClosingDoc(item);
				that.LocInstance.ClosingDocs.push(instance);
			}
		});
	}

	private SetLocDate(days: number): void {
		let nowDate = new Date();
		nowDate.setDate(nowDate.getDate() + days);
		this.Issue4Group.controls.EndLocDate.setValue(nowDate);
	}

	private SetLocDays(): void {
		let nowDate = new Date();
		let locDays = this.Issue4Group.controls.EndLocDate.valid ?
			Math.ceil((this.LocInstance.EndLocDate.getTime() - nowDate.getTime()) / 1000 / 3600 / 24) : "";

		if (this.Issue4Group.controls.LocDaysLength.value != locDays) {
			this.Issue4Group.controls.LocDaysLength.setValue(locDays.toString());
		}
	}

	public get ClosingDocs(): FormArray {
		return this.Issue4Group.get("ClosingDoc") as FormArray;
	}

	public IsValid(): boolean {
		this.Issue4Group.controls.EndLocDate.setValue(this.Issue4Group.controls.EndLocDate.value);

		this.Issue4Group.controls.EndLocDate.markAsTouched();

		return this.Issue4Group.controls.EndLocDate.valid;
	}

	public AddClosingDoc(item: ClosingDoc = null) {
		this.ClosingDocs.push(
			new FormGroup({
				Document: new FormControl(null !== item ? item.Document : ""),
				Amount: new FormControl(null !== item ? item.Amount : 1),
				OnlyOriginalDocument: new FormControl(null !== item ? item.OnlyOriginalDocument : true),
				AdditionalRequirements: new FormControl(null !== item ? item.AdditionalRequirements : ""),
			})
		);
	}
}
