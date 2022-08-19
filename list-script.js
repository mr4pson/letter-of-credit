const appendLetterOfCreditApp = () => {
    (function () {
        const container = document.body;

        console.log("Log: On app start");

        container.appendChild(document.createElement("loc-inner"));

        const scripts = [
            "http://localhost:5500/runtime.js",
            "http://localhost:5500/polyfills.js",
            "http://localhost:5500/styles.js",
            "http://localhost:5500/vendor.js",
            "http://localhost:5500/main.js",
            // "http://localhost/runtime.js",
            // "http://localhost/polyfills.js",
            // "http://localhost/styles.js",
            // "http://localhost/vendor.js",
            // "http://localhost/main.js"
        ];

        scripts.forEach((element) => {
            let el = document.createElement("script");
            el.src = element;
            el.defer = true;
            document.body.appendChild(el);
        });
    })();
};

const reloadScript = (path) => {
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = () => {
        if (!(xmlhttp.status === 200 && xmlhttp.readyState === 4)) {
            return;
        }

        console.log(`Log: On ${path} script content change`);

        let newContent = xmlhttp.responseText;
        if (path.includes("vendor-angular")) {
            newContent = xmlhttp.responseText.replaceAll(
                "(void 0===typeof ngDevMode||ngDevMode)",
                "(window.ngDevMode={})||false"
            );
        }

        const newScript = document.createElement("script");
        newScript.innerHTML = newContent;
        document.body.appendChild(newScript);
    };

    xmlhttp.open("GET", path, true);
    xmlhttp.send();
};

(function () {
    setTimeout(() => {
        console.log("Log: On DOM load");
        document.body.innerHTML = "<smb-app></smb-app>";

        const scriptSources = [];
        const scriptTags = document.getElementsByTagName("script");
        const number = new Number(scriptTags.length);

        for (let i = 0; i < number; i++) {
            const script = scriptTags[0];
            scriptSources.push(script.src.split(script.baseURI)[1]);
            script.remove();
        }

        delete window.webpackChunksmb_web;
        window.ngDevMode = {};

        scriptSources.forEach((scriptSource) => {
            if (scriptSource && !scriptSource.includes("polyfills")) {
                reloadScript(scriptSource);
                if (scriptSource.includes("main")) {
                    setTimeout(() => {
                        appendLetterOfCreditApp();
                    }, 200);
                }
            }
        });
    }, 500);
})();
