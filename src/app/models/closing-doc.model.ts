export class ClosingDoc {
	public AdditionalRequirements = "";
	public Amount = 1;
	public Document = "";
	public OnlyOriginalDocument = true;

	public constructor(item: ClosingDoc) {
		this.AdditionalRequirements = item.AdditionalRequirements;
		this.Amount = item.Amount;
		this.Document = item.Document;
		this.OnlyOriginalDocument = item.OnlyOriginalDocument;
	}
}
