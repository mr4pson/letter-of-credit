import { Injector } from '@angular/core';
import { ComponentDebugMetadata } from './component-debug-metadata.interface';
import { DirectiveDebugMetadata } from './directive-debug-metadata.interface';
import { Listener } from './listener.interface';

export interface Ng {
    applyChanges: (component: {}) => void;
    getComponent: <T>(element: Element) => T | null;
    getContext: <T>(element: Element) => T | null;
    getDirectiveMetadata: (directiveOrComponentInstance: any) => ComponentDebugMetadata | DirectiveDebugMetadata | null;
    getDirectives: (node: Node) => Array<{}>;
    getHostElement: (componentOrDirective: {}) => Element;
    getInjector: (elementOrDir: {} | Element) => Injector;
    getListeners: (element: Element) => Listener[];
    getOwningComponent<T>(elementOrDir: {} | Element): T | null;
    getRootComponent(elementOrDir: {} | Element): Array<{}>;
}
