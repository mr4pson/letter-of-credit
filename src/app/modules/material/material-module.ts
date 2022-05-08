import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  exports: [
    MatDialogModule,
    OverlayModule,
  ],
})
export class MaterialModule { }
