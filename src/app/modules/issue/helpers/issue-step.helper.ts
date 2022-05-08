import { Page, paths } from '../constants/routes';
import { Step } from '../interfaces/step.interface';

import { StoreService } from 'src/app/services/store.service';

export const getSteps = (store: StoreService): Step[] => {
  return [
    {
      title: 'Сумма аккредитива с комиссией',
      description: store.issueStep1Text,
      url: paths[Page.ACCREDITATION_AMOUNT],
    },
    {
      title: 'Контрагент',
      description: store.issueStep2Text,
      url: paths[Page.COUNTERPARTY],
    },
    {
      title: 'Договор с контрагентом',
      description: store.issueStep3Text,
      url: paths[Page.COUNTERPARTY_CONTRACT],
    },
    {
      title: 'Срок действия аккредитива',
      description: store.issueStep4Text,
      url: paths[Page.ACCREDITATION_PERIOD],
    },
    {
      title: 'Отправить заявку',
      url: paths[Page.SEND_APPLICATION],
    },
  ];
};
