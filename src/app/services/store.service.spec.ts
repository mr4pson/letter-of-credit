import { TestBed } from '@angular/core/testing';

import { ReceiverStatus } from '../enums/receiver-status.enum';
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
        service.receiverStatus = ReceiverStatus.Reliable;
        service.letterOfCredit.allowUsePartOfLoc = false;
        service.isIssueVissible = true;

        service.restoreDefaultState();

        expect(service.clientEmail).toEqual('');
        expect(service.receiverStatus).toEqual(ReceiverStatus.Unknown);
        expect(service.letterOfCredit).toEqual(DEFAULT_LOC_INSTANCE);
        expect(service.isIssueVissible).toBeFalsy();
    });
});
