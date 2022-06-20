import { Injectable } from '@angular/core';

import { SafePayStates } from '../enums/safe-payment.enum';
import { SafePayStateTransition } from '../interfaces/safe-pay-state-transition.interface';

@Injectable()
export class SafePaymentStateManagerService {
  private currentState: SafePayStates = SafePayStates.ShowAgenda;
  private routes: SafePayStateTransition[] = [
    {
      state: SafePayStates.ShowAgenda,
      nextState: SafePayStates.ShowEmail,
    },
  ];
  get state() {
    return this.currentState;
  }
  set state(state: SafePayStates) {
    const transition = this.routes.filter(t => t.state === this.currentState && t.nextState === state);
    if (!transition || transition.length === 0) {
      return;
    }

    this.currentState = state;
  }
}
