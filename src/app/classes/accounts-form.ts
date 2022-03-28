export class AccountsForm {
	private readonly FormSelector = "smb-app smb-account";

	public HideAccounsForm(): void {
		let that = this;
		let observer = new MutationObserver(function () {
			let form = document.querySelector(that.FormSelector);
			if (null === form) {
				return;
			}
			form.classList.add("hidden");

			observer.disconnect();
		});

		observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
	}

	public ShowAccounsForm(): void {
		let form = document.querySelector(this.FormSelector);
		if (null !== form) {
			form.classList.remove("hidden");
		}
	}
}
