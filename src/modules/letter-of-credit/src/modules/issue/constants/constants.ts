import { LetterOfCredit } from '../interfaces/letter-of-credit.interface';
import { Page, paths } from './routes';
import { Step } from '../interfaces/step.interface';

import { SelectedItem } from '@psb/fe-ui-kit';
import { LocaleDateConfig } from '../interfaces/locale-date-config.inteface';

export const NDS_LIST: Array<SelectedItem<number>> = [
    { id: 1, label: '0%', value: 0 },
    { id: 2, label: '10%', value: 10 },
    { id: 3, label: '20%', value: 20 },
];

export const FILE_EXTENSIONS: string[] = ['tiff', 'pdf', 'xml', 'doc', 'docx', 'xls', 'xlsx'];

export enum FileError {
    NotSuitableTypes = 'Не все загруженные файлы подходящего типа.',
}

export const DEFAULT_LOC_INSTANCE = {
    receiverInn: '',
    receiverName: '',
    receiverBankBik: '',
    receiverBankName: '',
    receiverAccount: '',
    contractDate: null,
    contract: '',
    contractInfo: '',
    endLocDate: null,
    locDaysNumber: 0,
    closingDocs: [],
    isDocumentDigital: true,
    allowUsePartOfLoc: true,
    contactPerson: '',
    contactPhone: '',
    paymentSum: 0,
    payerAccount: '',
    nds: NDS_LIST[2].value,
} as LetterOfCredit;

export const STEPS: Step[] = [
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

export const ruLocaleDateConfig: LocaleDateConfig = {
    locale: 'ru-RU',
    config: { year: 'numeric', month: 'long', day: 'numeric' }
};