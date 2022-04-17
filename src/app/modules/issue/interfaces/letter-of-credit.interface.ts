import { ClosingDoc } from './closing-doc.interface';

export class LetterOfCredit {
  reciverInn: string;
  reciverName: string;
  reciverBankBik: string;
  reciverBankName: string;
  reciverAccount: string;
  contractDate: Date;
  contract: string;
  contractInfo: string;
  endLocDate: Date;
  closingDocs: ClosingDoc[];
  isDocumentDigital: boolean;
  allowUsePartOfLoc: boolean;
  contactPerson: string;
  contactPhone: string;
}

