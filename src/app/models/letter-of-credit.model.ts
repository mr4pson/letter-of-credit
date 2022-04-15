import { ClosingDoc } from '../components/issue/interfaces/closing-doc.interface';

export class LetterOfCredit {
  public reciverInn = '';
  public reciverName = '';
  public reciverBankBik = '';
  public reciverBankName = '';
  public reciverAccount = '';

  public contractDate: Date = null;
  public contract = '';
  public contractInfo = '';

  public endLocDate: Date = null;

  public closingDocs: ClosingDoc[] = [];
  public isDocumentDigital = true;
  public allowUsePartOfLoc = true;

  public contactPerson = '';
  public contactPhone = '';
}
