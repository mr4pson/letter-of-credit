import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

import { ReciverStatus } from '../enums/reciver-status.enum';
import { SmbPayment } from '../interfaces/smb/smb-payment.interface';
import { DEFAULT_LOC_INSTANCE } from '../modules/issue/constants/constants';
import { LetterOfCredit } from '../modules/issue/interfaces/letter-of-credit.interface';

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

  dialog: MatDialog;
  payment: SmbPayment;
  reciverStatus: ReciverStatus = ReciverStatus.Unknown;
  clientEmail = '';
  letterOfCredit: LetterOfCredit = DEFAULT_LOC_INSTANCE;

  restoreDefaultState() {
    this.clientEmail = '';
    this.reciverStatus = ReciverStatus.Unknown;
    this.letterOfCredit = DEFAULT_LOC_INSTANCE;
    this.isIssueVissible = false;
  }
}
