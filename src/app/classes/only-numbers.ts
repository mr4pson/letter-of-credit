export class OnlyNumbers {
	private static AllowKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "Delete"];

	public static IsValid(event: KeyboardEvent) {
		if (!/^[0-9]*$/.test(event.key) && OnlyNumbers.AllowKeys.indexOf(event.key) < 0 && !(event.ctrlKey && "v" == event.key.toLowerCase())) {
			event.preventDefault();
			return false;
		}

		return true;
	}
}
