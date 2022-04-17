(function () {
	let locTagInterval = setInterval(function () {
		let container = document.querySelector("smb-app .container .content");
		if (null === container || 0 === container.childNodes.length) {
			return;
		}

		clearInterval(locTagInterval);

		console.log("pan! -- loc-inner");

		container.appendChild(document.createElement("loc-inner"));

		/* let styles = [
			"http://localhost/inner/styles.6220a346dfa2124b8ad9.css"
		];

		styles.forEach(element => {
			let el = document.createElement("link");
			el.href = element;
			el.rel = "stylesheet";
			document.body.appendChild(el);
		}); */

		let scripts = [
			/* "http://localhost/inner/runtime.a76d9be047b1cd035d90.js",
			"http://localhost/inner/polyfills.5a4b141df3d0ce5f4d97.js",
			"http://localhost/inner/vendor.95fa29808b6cd3881bd1.js",
			"http://localhost/inner/main.edf16ece3587799d76cb.js" */
			"http://localhost/inner/runtime.js",
			"http://localhost/inner/polyfills.js",
			"http://localhost/inner/styles.js",
			"http://localhost/inner/vendor.js",
			"http://localhost/inner/main.js"
		];

		scripts.forEach(element => {
			let el = document.createElement("script");
			el.src = element;
			el.defer = true;
			document.body.appendChild(el);
		});
	}, 100);
}());
