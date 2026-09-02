import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Superhero } from '../../../models/superhero.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule
  ],
  selector: 'app-hero-detail-dialog',
  templateUrl: './hero-detail-dialog.component.html',
  styleUrls: ['./hero-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailDialogComponent {
  readonly hero = inject<Superhero>(MAT_DIALOG_DATA);
}