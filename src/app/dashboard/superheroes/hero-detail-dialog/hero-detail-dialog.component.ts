import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Superhero } from '../../../models/superhero.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [
   CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule
],
  selector: 'app-hero-detail-dialog',
  templateUrl: './hero-detail-dialog.component.html',
  styleUrls: ['./hero-detail-dialog.component.scss']
})
export class HeroDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public hero: Superhero) {}
}
