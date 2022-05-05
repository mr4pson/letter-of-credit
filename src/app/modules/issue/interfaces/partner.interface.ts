import { PartnerBank } from '../../../interfaces/api/api-partner-bank.interface';

export interface Partner {
  shortName: string;
  inn: string;
  banks: PartnerBank[];
}
