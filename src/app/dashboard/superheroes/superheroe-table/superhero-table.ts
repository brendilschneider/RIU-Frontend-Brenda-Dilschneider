import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { DialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { HeroDetailDialogComponent } from '../hero-detail-dialog/hero-detail-dialog.component';
import { LoadingService } from '../../../core/services/loading.service';

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
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressBarModule
  ],
  selector: 'app-superhero-table',
  styleUrl: './superhero-table.scss',
  templateUrl: './superhero-table.html',
})
export class SuperheroTableComponent implements OnInit {

  private superheroService = inject(SuperheroesService);
  public loadingService = inject(LoadingService);

  private router = inject(Router);
  private dialogService = inject(DialogService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

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
    this.superheroService.getAllHeroes().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: heroes => {
        this.heroes.set(heroes);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.snackBar.open('Error loading heroes', 'Close', { duration: 3000 });
      }
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

  viewHeroDetails(hero: Superhero) {
    this.dialog.open(HeroDetailDialogComponent, {
      data: hero,
      width: '600px',
      panelClass: 'hero-dialog'
    });
  }

  editHero(hero: Superhero) {
    this.router.navigate(['/hero', hero.id]);
  }

  deleteHero(hero: Superhero) {
    this.dialogService.openDeleteConfirm(hero.name).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(confirmed => {
      if (confirmed) {
        this.superheroService.delete(hero.id).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            this.heroes.set(this.heroes().filter(h => h.id !== hero.id));
            this.snackBar.open('Superhero deleted successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Could not delete the superhero.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

}
