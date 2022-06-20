import { TestBed } from '@angular/core/testing';

import { ReciverStatus } from '../enums/reciver-status.enum';
import { DEFAULT_LOC_INSTANCE } from '../modules/issue/constants/constants';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoreService,
      ],
    });

    service = TestBed.inject(StoreService);
  });

  it('Восстанавливет дефолтный состояние стора', () => {
    service.clientEmail = 'test';
    service.reciverStatus = ReciverStatus.Reliable;
    service.letterOfCredit.allowUsePartOfLoc = false;
    service.isIssueVissible = true;

    service.restoreDefaultState();

    expect(service.clientEmail).toEqual('');
    expect(service.reciverStatus).toEqual(ReciverStatus.Unknown);
    expect(service.letterOfCredit).toEqual(DEFAULT_LOC_INSTANCE);
    expect(service.isIssueVissible).toBeFalsy();
  });
});
