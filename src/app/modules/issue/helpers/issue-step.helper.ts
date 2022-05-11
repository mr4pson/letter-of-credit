import { Page, paths } from '../constants/routes';
import { Step } from '../interfaces/step.interface';

import { StoreService } from 'src/app/services/store.service';

export const getSteps = (store: StoreService): Step[] => {
  return [
    {
      title: 'Сумма аккредитива с комиссией',
      url: paths[Page.ACCREDITATION_AMOUNT],
    },
    {
      title: 'Контрагент',
      url: paths[Page.COUNTERPARTY],
    },
    {
      title: 'Договор с контрагентом',
      url: paths[Page.COUNTERPARTY_CONTRACT],
    },
    {
      title: 'Срок действия аккредитива',
      url: paths[Page.ACCREDITATION_PERIOD],
    },
    {
      title: 'Отправить заявку',
      url: paths[Page.SEND_APPLICATION],
    },
  ];
};
