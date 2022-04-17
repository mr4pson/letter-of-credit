import { PartnerBank } from '../../../classes/interfaces/api-partner-bank.interface';

export interface Partner {
  shortName: string;
  inn: string;
  banks: PartnerBank[];
}
