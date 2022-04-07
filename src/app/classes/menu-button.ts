import { Router } from '@angular/router';
export class MenuButton {
  public constructor(
    private route: Router,
  ) { }

  public appendMenuBidItem() {
    const observer = new MutationObserver(() => {
      const menu = document.querySelector('smb-app .menu.main-menu .menu-items');
      if (null === menu) {
        return;
      }

      observer.disconnect();

      const li = document.createElement('li');
      li.classList.add('tooltip-link', 'hover');

      const link = document.createElement('a');
      link.href = '#';
      link.onclick = () => false;
      link.classList.add('menu-item', 'waves-effect', 'bid-menu-item');

      const linkIcon = document.createElement('span');
      linkIcon.classList.add('menu-icon', 'menu-icon-account', 'icon', 'smb-file-document-box');

      const linkText = document.createElement('span');
      linkText.classList.add('menu-text');
      linkText.textContent = 'Заявки';

      link.appendChild(linkIcon);
      link.appendChild(linkText);

      const tooltip = document.createElement('div');
      tooltip.classList.add('tooltip-right');

      const tooltipInner = document.createElement('span');
      tooltipInner.classList.add('tooltip-content', 'animation-fadein');
      tooltipInner.textContent = 'Заявки';

      tooltip.appendChild(tooltipInner);

      li.appendChild(link);
      li.appendChild(tooltip);

      menu.appendChild(li);

      link.addEventListener('click', () => this.navigate2Bid());
      tooltip.addEventListener('click', () => this.navigate2Bid());
    });

    observer.observe(document.querySelector('smb-app'), { subtree: true, childList: true });
  }

  private navigate2Bid() {
    this.route.navigateByUrl('/bid');
  }
}
