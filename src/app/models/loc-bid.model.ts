import { BidStatus } from '../classes/bid-status';

export class LocBid {
  public status = BidStatus.None;
  public number = 0;
  public created = '';
  public clientInn = '';
  public clientCompany = '';
  public contract = '';
  public contractCase = '';
  public sum = 0.0;
  public bankExecutor = '';
  public sumFormatted = () => `${this.sum.toString().replace(/\d(?=(\d{3})+$)/g, '$& ')} ₽`;
}
