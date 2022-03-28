import {ClosingDoc} from "./closing-doc.model";

export class LetterOfCredit {
	public ReciverInn = "";
	public ReciverName = "";
	public ReciverBankBik = "";
	public ReciverBankName = "";
	public ReciverAccount = "";

	public ContractDate: Date = null;
	public Contract = "";
	public ContractInfo = "";

	public EndLocDate: Date = null;

	public ClosingDocs: ClosingDoc[] = [];
	public PerhapsDigitalDoc = true;
	public AllowUsePartOfLoc = true;

	public ContactPersone = "";
	public ContactPhone = "";
}
