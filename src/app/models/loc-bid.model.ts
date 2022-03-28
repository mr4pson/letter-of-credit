import {BidStatus} from "../classes/bid-status";

export class LocBid {
	public Status = BidStatus.None;
	public Number = 0;
	public Created = "";
	public ClientInn = "";
	public ClientCompany = "";
	public Contract = "";
	public ContractCase = "";
	public Sum = 0.0;
	public SumFormatted = () => this.Sum.toString().replace(/\d(?=(\d{3})+$)/g, '$& ') + " ₽";
	public BankExecutor = "";
}
