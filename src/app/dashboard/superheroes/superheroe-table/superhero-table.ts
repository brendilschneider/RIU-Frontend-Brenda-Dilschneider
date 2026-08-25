import { Component, inject, OnInit, signal } from '@angular/core';
import { SuperheroesService } from '../../../core/services/superheroes-service';
import { Superhero } from '../../../models/superhero.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  selector: 'app-superhero-table',
  styleUrl: './superhero-table.scss',
  templateUrl: './superhero-table.html',
})
export class SuperheroTableComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'name', 'intelligence', 'power', 'actions'];

  pagedHeroes = signal<Superhero[]>([]);
  pageSize = 10;

  private superheroService = inject(SuperheroesService);

  ngOnInit(): void {
    this.superheroService.getAllHeroes().subscribe({
      next: (data) => {
        this.pagedHeroes.set(data.slice(0, this.pageSize));
      },
      error: (err) => console.error('Error to load superheroes:', err)
    });
  }

}
