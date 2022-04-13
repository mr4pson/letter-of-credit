import {Router} from "@angular/router";
import {StoreService} from "../models/state.service";

export class MenuButton {
	public constructor(private RouterInstance: Router, private Store: StoreService) { }

	public AppendMenuBidItem() {
		let that = this;
		let observer = new MutationObserver(function () {
			let menu = document.querySelector("smb-app .menu.main-menu .menu-items");
			if (null === menu) {
				return;
			}

			observer.disconnect();

			let li = document.createElement("li");
			li.classList.add("tooltip-link", "hover");

			let link = document.createElement("a");
			link.href = "#";
			link.onclick = () => false;
			link.classList.add("menu-item", "waves-effect", "bid-menu-item");

			let linkIcon = document.createElement("span");
			linkIcon.classList.add("menu-icon", "menu-icon-account", "icon", "smb-file-document-box");

			let linkText = document.createElement("span");
			linkText.classList.add("menu-text");
			linkText.textContent = "Заявки"

			link.appendChild(linkIcon);
			link.appendChild(linkText);

			let tooltip = document.createElement("div");
			tooltip.classList.add("tooltip-right");

			let tooltipInner = document.createElement("span");
			tooltipInner.classList.add("tooltip-content", "animation-fadein");
			tooltipInner.textContent = "Заявки";

			tooltip.appendChild(tooltipInner);

			li.appendChild(link);
			li.appendChild(tooltip);

			menu.appendChild(li);

			link.addEventListener('click', () => that.Navigate2Bid(that));
			tooltip.addEventListener('click', () => that.Navigate2Bid(that));
		});

		observer.observe(document.querySelector("smb-app"), {"subtree": true, "childList": true});
	}

	private Navigate2Bid(that: MenuButton) {
		that.RouterInstance.navigateByUrl("/bid");
	}
}
