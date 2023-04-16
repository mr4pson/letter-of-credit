import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { DirectiveDebugMetadata } from './directive-debug-metadata.interface';

export interface ComponentDebugMetadata extends DirectiveDebugMetadata {
    encapsulation: ViewEncapsulation;
    changeDetection: ChangeDetectionStrategy;
    inputs: Record<string, string>;
    outputs: Record<string, string>;
}
