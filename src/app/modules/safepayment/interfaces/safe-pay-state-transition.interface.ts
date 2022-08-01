import { SafePayStates } from '../enums/safe-payment.enum';

export interface SafePayStateTransition {
    state: SafePayStates;
    nextState: SafePayStates;
}
