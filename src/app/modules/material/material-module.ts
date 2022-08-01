import { NgModule } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
    exports: [
        MatDialogModule,
        OverlayModule,
    ],
    providers: [
        {
            provide: MatDialogRef,
            useValue: {}
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
    ]
})
export class MaterialModule { }
