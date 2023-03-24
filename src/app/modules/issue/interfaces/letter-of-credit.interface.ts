import { ClosingDoc } from './closing-doc.interface';

export interface LetterOfCredit {
    receiverInn: string;
    receiverName: string;
    receiverBankBik: string;
    receiverBankName: string;
    receiverAccount: string;
    contractDate: Date;
    contract: string;
    contractInfo: string;
    endLocDate: Date;
    locDaysNumber: number;
    closingDocs: ClosingDoc[];
    isDocumentDigital: boolean;
    allowUsePartOfLoc: boolean;
    contactPerson: string;
    contactPhone: string;
    paymentSum: number;
    payerAccount: string;
    nds: number;
}

