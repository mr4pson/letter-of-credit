import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootloader, hmrModule } from '@angularclass/hmr';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}

export function main() {
    return platformBrowserDynamic().bootstrapModule(AppModule)
        // use `hmrModule` or the "@angularclass/hmr-loader"
        .then((ngModuleRef: any) => {
            return hmrModule(ngModuleRef, module);
        });
}

bootloader(main);
