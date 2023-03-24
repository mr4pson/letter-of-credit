import { Injectable } from "@angular/core";
import moment from "moment";
import { BehaviorSubject } from "rxjs";
import { LetterEditModel } from "src/api/models";

import { ReceiverStatus } from "../enums/receiver-status.enum";
import { SmbPayment } from "../interfaces/smb/smb-payment.interface";
import { getNdsSum } from "../modules/issue/components/send-application/helpers";
import { DEFAULT_LOC_INSTANCE } from "../modules/issue/constants/constants";
import { ApplicationFile } from "../modules/issue/interfaces/application-file.inteface";
import { LetterOfCredit } from "../modules/issue/interfaces/letter-of-credit.interface";

@Injectable()
export class StoreService {
    private isIssueVissible$$ = new BehaviorSubject(false);
    isIssueVissible$ = this.isIssueVissible$$.asObservable();
    get isIssueVissible(): boolean {
        return this.isIssueVissible$$.getValue();
    }
    set isIssueVissible(visibility: boolean) {
        this.isIssueVissible$$.next(visibility);
    }

    private isOrdinalPayment$$ = new BehaviorSubject(false);
    isOrdinalPayment$ = this.isOrdinalPayment$$.asObservable();
    get isOrdinalPayment(): boolean {
        return this.isOrdinalPayment$$.getValue();
    }
    set isOrdinalPayment(value: boolean) {
        this.isOrdinalPayment$$.next(value);
    }

    payment: SmbPayment;
    receiverStatus: ReceiverStatus = ReceiverStatus.Unknown;
    clientEmail = "";
    letterOfCredit: LetterOfCredit = { ...DEFAULT_LOC_INSTANCE };
    buttonsOldConfig: {
        send: () => void;
        sign: () => void;
        save: () => void;
    }

    restoreDefaultState(): void {
        this.clientEmail = "";
        this.receiverStatus = ReceiverStatus.Unknown;
        this.letterOfCredit = { ...DEFAULT_LOC_INSTANCE };
        this.payment = null;
        this.isIssueVissible = false;
    }

    getLcDocumentsClientIdCreatePayload(files: ApplicationFile[]): LetterEditModel {
        return {
            total: this.letterOfCredit.paymentSum,
            account: this.letterOfCredit.payerAccount,
            contractorTitle: this.letterOfCredit.receiverName,
            contractorINN: this.letterOfCredit.receiverInn,
            bic: this.letterOfCredit.receiverBankBik,
            contractorAccount: this.letterOfCredit.payerAccount,
            contractDate: moment(this.letterOfCredit.contractDate).format('YYYY-MM-DD'),
            ndsValue: this.letterOfCredit.nds,
            ndsSum: getNdsSum(this.letterOfCredit.nds, this.letterOfCredit.paymentSum),
            contractTitleAndNumber: this.letterOfCredit.contract,
            contractSubject: this.letterOfCredit.contractInfo,
            contractFiles: files,
            lcEndDate: moment(this.letterOfCredit.endLocDate).format('YYYY-MM-DD'),
            lcDuration: Number(this.letterOfCredit.locDaysNumber),
            closingDocuments: this.letterOfCredit.closingDocs.map(doc => ({
                additionalRequirements: doc.additionalRequirements,
                documentsCount: Number(doc.amount),
                documentTitle: doc.document,
                originalOnly: doc.onlyOriginalDocument
            })),
            electronicSubmission: true,
            partialPayment: true,
            agreement: true,
            addToTemplates: true,
            contactPerson: this.letterOfCredit.contactPerson,
            contactPhone: this.letterOfCredit.contactPhone
        }
    }
}
