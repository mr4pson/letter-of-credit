(function () {
	// let locTagInterval1 = setInterval(function () {
		let container = document.querySelector(".main-layout .content");
		// if (null === container || 0 === container.childNodes.length) {
		// 	return;
		// }

		// clearInterval(locTagInterval1);

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
			"http://localhost:4200/runtime.js",
			"http://localhost:4200/polyfills.js",
			"http://localhost:4200/styles.js",
			"http://localhost:4200/vendor.js",
			"http://localhost:4200/main.js"
		];

		scripts.forEach(element => {
			let el = document.createElement("script");
			el.src = element;
			el.defer = true;
			document.body.appendChild(el);
		});
	// }, 100);
}());
