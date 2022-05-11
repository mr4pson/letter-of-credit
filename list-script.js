const appendLetterOfCreditApp = () => {
	const newScript = document.createElement('script');
	newScript.innerHTML = newContent;
	document.body.appendChild(newScript);

	(function () {
		const container = document.body;

		console.log("pan! -- loc-inner");

		container.appendChild(document.createElement("loc-inner"));

		const scripts = [
			/* "http://localhost/inner/runtime.a76d9be047b1cd035d90.js",
			"http://localhost/inner/polyfills.5a4b141df3d0ce5f4d97.js",
			"http://localhost/inner/vendor.95fa29808b6cd3881bd1.js",
			"http://localhost/inner/main.edf16ece3587799d76cb.js" */
			"http://localhost/runtime.js",
			"http://localhost/polyfills.js",
			"http://localhost/styles.js",
			"http://localhost/vendor.js",
			"http://localhost/main.js"
		];

		scripts.forEach(element => {
			let el = document.createElement("script");
			el.src = element;
			el.defer = true;
			document.body.appendChild(el);
		});
	}());
}

(function () {
	console.log('Log: On DOM load');

	const scripts = document.getElementsByTagName('script');
	const mainScript = Array.from(scripts).find(script => script.attributes.src && script.attributes.src.value.indexOf('main') != -1);
	mainScript.remove();

	const smbApp = document.getElementsByTagName('smb-app')[0];  
	smbApp.remove();

	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = () => {
		if(!(xmlhttp.status === 200 && xmlhttp.readyState === 4)) {
			return;
		}

		console.log('Log: On main script content change');
		
		// window.ngDevMode = true; triggers error
		const newContent = xmlhttp.responseText.replaceAll(
			'(void 0===typeof ngDevMode||ngDevMode)&&(ae.ngDevMode=!1)',
			'(window.ngDevMode={})'
		);

		const smbApp = document.createElement('smb-app');
		document.body.appendChild(smbApp);
		
		const newScript = document.createElement('script');
		newScript.innerHTML = newContent;
		document.body.appendChild(newScript);

		setTimeout(appendLetterOfCreditApp);
	}

	// TODO make js file pick dynamic
	xmlhttp.open("GET", "build-1.57.1/main-b5014ab4de95bb3c5fe9.js" , true);
	xmlhttp.send();
}());