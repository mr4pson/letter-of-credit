import { ApiAccount } from '../classes/interfaces/api-account.interface';

export class ClientAccount {
  public title = 'Расчётный';
  public accountCode = '';
  public balance = 0;
  private accountCodeFormatted = '';
  private balanceFormatted = '';

  public constructor(data: ApiAccount = null) {
    if (null !== data) {
      this.accountCode = data.code;
      this.balance = data.balance;
    }
  }

  public getFormattedBalance(): string {
    if ('' === this.balanceFormatted) {
      this.balanceFormatted =  `${this.balance.toString().replace(/\d(?=(\d{3})+$)/g, '$& ')} ₽`;
    }

    return this.balanceFormatted;
  }

  public getFormattedAccountCode() {
    if ('' === this.accountCodeFormatted) {
      this.accountCodeFormatted = `${this.accountCode.substr(0, 3)} ${this.accountCode.substr(3, 2)} ${this.accountCode.substr(5, 3)} ${this.accountCode.substr(8, 1)} ${this.accountCode.substr(9, 4)} ${this.accountCode.substr(13)}`;
    }

    return this.accountCodeFormatted;
  }
}
