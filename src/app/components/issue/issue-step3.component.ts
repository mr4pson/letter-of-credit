import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {ButtonType} from "@psb/fe-ui-kit/src/components/button";
import {SelectedItem} from "@psb/fe-ui-kit/src/components/input-select";
import {getRequiredFormControlValidator} from "@psb/validations/required";
import {SimplebarAngularComponent} from "simplebar-angular/lib/simplebar-angular.component";

import {FormatHelper} from "src/app/classes/format-helper";
import {FileUploaded} from "src/app/models/file-upload.model";
import {LetterOfCredit} from "src/app/models/letter-of-credit.model";
import {StoreService} from "src/app/models/state.service";

@Component({
	selector: "loc-issue-step3",
	templateUrl: "issue-step3.component.html",
	styleUrls: ["issue-step3.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class IssueStep3Component implements OnInit {
	public Issue3Group = new FormGroup({
		ContractDate: new FormControl('', [
			getRequiredFormControlValidator("Укажите дату заключения договора"),
		]),
		SelectedNds: new FormControl(),
		Contract: new FormControl('', [
			getRequiredFormControlValidator("Укажите название и номер договора"),
		]),
		ContractInfo: new FormControl('', [
			getRequiredFormControlValidator("Укажите предмет договора"),
		]),
	});

	public NdsList: SelectedItem[] = [];

	public ButtonType = ButtonType;
	public ErrorMessage = "";
	public MaxContractDate = new Date();
	public SelectedNds = 20;

	public Files: FileUploaded[] = [];
	private Extensions = ["tiff", "pdf", "xml", "doc", "docx", "xls", "xlsx"];

	@Input() LocInstance: LetterOfCredit;

	constructor(private Store: StoreService) { }

	ngOnInit(): void {
		this.InitNdsList();

		var that = this;
		this.Issue3Group.get("SelectedNds")?.valueChanges.subscribe(() => {
			let title = that.Issue3Group.controls.SelectedNds.value;
			that.SelectedNds = that.NdsList.find((el: SelectedItem) => el.label == title)?.value;
		});

		this.Issue3Group.get("ContractDate")?.valueChanges.subscribe(() => {
			that.LocInstance.ContractDate = that.Issue3Group.controls.ContractDate.valid ?
				that.Issue3Group.controls.ContractDate.value : "";
		});

		this.Issue3Group.get("Contract")?.valueChanges.subscribe(() => {
			that.LocInstance.Contract = that.Issue3Group.controls.Contract.valid ?
				that.Issue3Group.controls.Contract.value : "";
		});

		this.Issue3Group.get("ContractInfo")?.valueChanges.subscribe(() => {
			that.LocInstance.ContractInfo = that.Issue3Group.controls.ContractInfo.valid ?
				that.Issue3Group.controls.ContractInfo.value : "";
		});

		this.Issue3Group.controls.ContractDate.setValue(this.LocInstance.ContractDate);
		this.Issue3Group.controls.Contract.setValue(this.LocInstance.Contract);
		this.Issue3Group.controls.ContractInfo.setValue(this.LocInstance.ContractInfo);
	}

	public get ContractValue() {
		return this.Issue3Group.controls.Contract.value;
	}

	public IsValid(): boolean {
		this.Issue3Group.controls.ContractDate.setValue(this.Issue3Group.controls.ContractDate.value);

		this.Issue3Group.controls.ContractDate.markAsTouched();
		this.Issue3Group.controls.Contract.markAsTouched();
		this.Issue3Group.controls.ContractInfo.markAsTouched();

		return this.Issue3Group.controls.ContractDate.valid &&
			this.Issue3Group.controls.Contract.valid &&
			this.Issue3Group.controls.ContractInfo.valid;
	}

	public OnSelectFile(event: any) {
		let rejectedFiles = 0;

		for (let index in event.addedFiles) {
			let file: File = event.addedFiles[index];
			let extension = file.name.split('.').pop().toLowerCase();
			if (this.Extensions.indexOf(extension) < 0) {
				rejectedFiles++;
				continue;
			}

			if (this.Files.find(f => f.Native.name == file.name && f.Native.size == file.size)) {
				this.SetErrorMessage("Файл \"" + file.name + "\" уже загружен.");
				continue;
			}

			let instance = new FileUploaded();
			instance.Native = file;
			instance.SizeFormatted = FormatHelper.GetSizeFormatted(instance.Native.size);

			this.Files.push(instance);
		}

		if (rejectedFiles > 0) {
			this.SetErrorMessage("Не все загруженные файлы подходящего типа.");
		}
	}

	public OnRemoveFile(event: FileUploaded) {
		if (confirm("Удалить документ \"" + event.Native.name + "\" из списка загруженных?")) {
			this.Files.splice(this.Files.indexOf(event), 1);
		}
	}

	public SetVat() {
		if (0 == this.SelectedNds) {
			this.SelectedNds = 20;
			this.Issue3Group.controls.SelectedNds.setValue(this.NdsList[this.NdsList.length - 1].label);
		}
	}

	public UnSetVat() {
		if (this.SelectedNds > 0) {
			this.SelectedNds = 0;
			this.Issue3Group.controls.SelectedNds.setValue(this.NdsList[0].label);
		}
	}

	public WheelScroll(event: any, el: SimplebarAngularComponent) {
		event.preventDefault();
		el.SimpleBar.getScrollElement().scrollLeft += event.deltaY;
	}

	private SetErrorMessage(message: string) {
		this.ErrorMessage = message;

		let that = this;
		setTimeout(function () {
			that.ErrorMessage = "";
		}, 15000);
	}

	private InitNdsList() {
		this.NdsList.push({id: 1, label: "0%", value: 0});
		this.NdsList.push({id: 2, label: "10%", value: 10});
		this.NdsList.push({id: 3, label: "20%", value: 20});
		this.Issue3Group.controls.SelectedNds.setValue(this.NdsList[this.NdsList.length - 1].label);
	}
}
