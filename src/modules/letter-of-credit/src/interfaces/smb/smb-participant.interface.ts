import { SmbAccount } from "./smb-account.interface";
import { SmbBankInfo } from "./smb-bank-info.interface";

export interface SmbParticipant {
    inn: string;
    kpp: string;
    name: string;
    displayName: string;
    fullName: string;
    id: number;
    okpo: string;
    toStringName: boolean;
    account: SmbAccount;
    bankInfo: SmbBankInfo;
}
