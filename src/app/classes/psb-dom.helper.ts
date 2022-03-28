export class PsbDomHelper {
	public static GetNewPaymentButtonElement(): Element | null {
		return document.querySelector(".col-new-payment button.new-payment");
	}

	public static GetNewLocPaymentButtonElement(): Element | null {
		return document.querySelector(".col-new-payment button.new-payment.js-new-loc");
	}
	public static HideDocuments(): void {
		document.querySelector("smb-documents")?.classList.add("hidden");
	}

	public static ShowDocuments(): void {
		document.querySelector("smb-documents")?.classList.remove("hidden");
	}
}
