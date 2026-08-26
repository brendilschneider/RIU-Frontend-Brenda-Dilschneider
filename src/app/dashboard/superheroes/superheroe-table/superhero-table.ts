import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
import { Router } from '@angular/router';

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

  private superheroService = inject(SuperheroesService);
  private router = inject(Router);

  displayedColumns: string[] = ['avatar', 'name', 'intelligence', 'power', 'actions'];

  heroes = signal<Superhero[]>([]);
  searchQuery = signal('');
  pageIndex = signal(0);
  pageSize = signal(10);
  isLoading = signal(false);
  
  filteredHeroes = computed(() =>
    this.heroes().filter(h =>
      h.name.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  paginatedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(start, start + this.pageSize());
  });

  totalHeroes = computed(() => this.filteredHeroes().length);

  ngOnInit(): void {
    this.isLoading.set(true);
    this.superheroService.getAllHeroes().subscribe({
      next: heroes => {
        this.heroes.set(heroes);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.pageIndex.set(0);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  addNewHero() {
    this.router.navigate(['/hero/new']);
  }

  editHero(hero: Superhero) {
    this.router.navigate(['/hero', hero.id]);
  }

}
