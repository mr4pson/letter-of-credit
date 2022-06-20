import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Agenda } from '../../interfaces/agenda.interface';
import { AGENDA_ITEMS } from './constants';

@Component({
  selector: 'safe-payment-agenda',
  templateUrl: 'safe-payment-agenda.component.html',
  styleUrls: ['safe-payment-agenda.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SafePaymentAgendaComponent {
  agendaItems: Agenda[] = AGENDA_ITEMS;

  getAgendaItemNumber(index: number): number {
    return index + 1;
  }

  checkItemHasDelimiter(index: number) {
    return index < this.agendaItems.length - 1;
  }
}
