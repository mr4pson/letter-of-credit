export class AccountsForm {
  private readonly formSelector = 'smb-app smb-account';

  public hideAccounsForm(): void {
    const observer = new MutationObserver(() => {
      const form = document.querySelector(this.formSelector);
      if (null === form) {
        return;
      }
      form.classList.add('hidden');

      observer.disconnect();
    });

    observer.observe(document.querySelector('smb-app'), { subtree: true, childList: true });
  }

  public showAccounsForm(): void {
    const form = document.querySelector(this.formSelector);
    if (null !== form) {
      form.classList.remove('hidden');
    }
  }
}
