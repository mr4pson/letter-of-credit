import { ClientAccount } from '../interfaces/client-account.interface';

export const getFormattedBalance = (clientAccount: ClientAccount): string => {
    return `${clientAccount.balance.toString().replace(/\d(?=(\d{3})+$)/g, '$& ')} ₽`;
};

export const getFormattedAccountCode = ({ accountCode }: ClientAccount): string =>
    `${accountCode.substr(0, 3)} ${accountCode.substr(3, 2)} ${accountCode.substr(5, 3)} ${accountCode.substr(8, 1)} ${accountCode.substr(9, 4)} ${accountCode.substr(13)}`;
