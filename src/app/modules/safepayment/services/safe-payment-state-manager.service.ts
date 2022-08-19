import { Injectable } from '@angular/core';

import { SafePayStates } from '../enums/safe-payment.enum';

@Injectable()
export class SafePaymentStateManagerService {
    private currentState: SafePayStates = SafePayStates.ShowAgenda;
    get state() {
        return this.currentState;
    }
    set state(state: SafePayStates) {
        this.currentState = state;
    }
}
