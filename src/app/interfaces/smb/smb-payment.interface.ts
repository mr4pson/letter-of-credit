import { SmbParticipant } from './smb-participant.interface';

export interface SmbPayment {
  number: number;
  summa: number;
  receiver: SmbParticipant;
  sender: SmbParticipant;
}
