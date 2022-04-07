export class ClosingDoc {
  public additionalRequirements = '';
  public amount = 1;
  public document = '';
  public onlyOriginalDocument = true;

  public constructor(item: ClosingDoc) {
    this.additionalRequirements = item.additionalRequirements;
    this.amount = item.amount;
    this.document = item.document;
    this.onlyOriginalDocument = item.onlyOriginalDocument;
  }
}
