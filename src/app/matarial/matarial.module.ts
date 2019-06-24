import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';

const MaterialDependenci = [
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatToolbarModule,
]

@NgModule({
  imports: [
    CommonModule,
    MaterialDependenci
  
  ],
  exports:[
    MaterialDependenci
  ]
})
export class MatarialModule { }
