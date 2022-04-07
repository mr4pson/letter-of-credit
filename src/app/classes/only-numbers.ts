export class OnlyNumbers {
  private static allowKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];

  public static isValid(event: KeyboardEvent) {
    if (
      !/^[0-9]*$/.test(event.key)
      && OnlyNumbers.allowKeys.indexOf(event.key) < 0
      && !(event.ctrlKey && 'v' === event.key.toLowerCase())
    ) {
      event.preventDefault();

      return false;
    }

    return true;
  }
}
