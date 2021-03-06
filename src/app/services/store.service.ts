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
  public isIssueVissible$ = this.isIssueVissible$$.asObservable();
  public get isIssueVissible(): boolean {
    return this.isIssueVissible$$.getValue();
  }
  public set isIssueVissible(visibility: boolean) {
    this.isIssueVissible$$.next(visibility);
  }

  private isOrdinalPayment$$ = new BehaviorSubject(false);
  public isOrdinalPayment$ = this.isOrdinalPayment$$.asObservable();
  public get isOrdinalPayment(): boolean {
    return this.isOrdinalPayment$$.getValue();
  }
  public set isOrdinalPayment(value: boolean) {
    this.isOrdinalPayment$$.next(value);
  }

  public dialog: MatDialog;
  public payment: SmbPayment;
  public reciverStatus: ReciverStatus = ReciverStatus.Unknown;
  public clientEmail = '';
  public letterOfCredit: LetterOfCredit = DEFAULT_LOC_INSTANCE;

  public restoreDefaultState() {
    this.clientEmail = '';
    this.reciverStatus = ReciverStatus.Unknown;
    this.letterOfCredit = DEFAULT_LOC_INSTANCE;
    this.isIssueVissible = false;
  }
}
