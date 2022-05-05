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

  public dialog: MatDialog;
  public payment: SmbPayment;
  public reciverStatus: ReciverStatus = ReciverStatus.Unknown;
  public clientEmail = '';
  public issueStep1Text = '';
  public issueStep2Text = '';
  public issueStep3Text = '';
  public issueStep4Text = '';
  public letterOfCredit: LetterOfCredit = DEFAULT_LOC_INSTANCE;

  public restoreDefaultState() {
    this.clientEmail = '';
    this.reciverStatus = ReciverStatus.Unknown;
    this.letterOfCredit = DEFAULT_LOC_INSTANCE;
    this.isIssueVissible = false;
  }
}
