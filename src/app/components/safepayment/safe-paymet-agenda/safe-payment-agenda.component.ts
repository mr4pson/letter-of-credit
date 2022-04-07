import { Component } from '@angular/core';

export interface Agenda {
  title: string;
}

@Component({
  selector: 'safe-payment-agenda',
  templateUrl: 'safe-payment-agenda.component.html',
  styleUrls: ['safe-payment-agenda.component.scss'],
})
export class SafePaymentAgendaComponent {
  agendaItems: Agenda[] = [
    {
      title: 'Выпуск аккредитива, деньги списываются на счёт в банке',
    },
    {
      title: 'Поставка',
    },
    {
      title: 'Проверка банком закрывающих документов, предоставленых вашими поставщиком',
    },
    {
      title: 'Банк переводит деньги поставщику',
    },
  ];

  getAgendaItemNumber(index: number): number {
    return index + 1;
  }

  checkItemHasDelimiter(index: number) {
    return index < this.agendaItems.length - 1;
  }
}
