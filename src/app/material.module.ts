// material.module.ts

import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  exports: [
    MatToolbarModule,
    MatSidenavModule,
    // ... add more Angular Material modules as needed
  ],
})
export class MaterialModule { }
