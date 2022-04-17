import { LetterOfCredit } from '../interfaces/letter-of-credit.interface';

import { SelectedItem } from '@psb/fe-ui-kit';

export const NDS_LIST: Array<SelectedItem<number>> = [
  { id: 1, label: '0%', value: 0 },
  { id: 2, label: '10%', value: 10 },
  { id: 3, label: '20%', value: 20 },
];

export const FILE_EXTENSIONS: string[] = ['tiff', 'pdf', 'xml', 'doc', 'docx', 'xls', 'xlsx'];

export const DEFAULT_LOC_INSTANCE = {
  reciverInn: '',
  reciverName: '',
  reciverBankBik: '',
  reciverBankName: '',
  reciverAccount: '',
  contractDate: null,
  contract: '',
  contractInfo: '',
  endLocDate: null,
  closingDocs: [],
  isDocumentDigital: true,
  allowUsePartOfLoc: true,
  contactPerson: '',
  contactPhone: '',
} as LetterOfCredit;
