import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SuperheroesService } from '../../../core/services/superheroes-service';
import { Superhero } from '../../../models/superhero.model';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressBarModule,
    ReactiveFormsModule
  ],
  selector: 'app-superhero-table',
  styleUrl: './superhero-table.scss',
  templateUrl: './superhero-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperheroTableComponent implements OnInit {

  private _superheroService = inject(SuperheroesService);
  public loadingService = inject(LoadingService);

  private _router = inject(Router);
  private _dialogService = inject(DialogService);
  private _snackBar = inject(MatSnackBar);
  private _dialog = inject(MatDialog);
  private _destroyRef = inject(DestroyRef);
  private _titleService = inject(Title);

  displayedColumns: string[] = ['avatar', 'name', 'intelligence', 'power', 'actions'];

  heroes = signal<Superhero[]>([]);
  pageIndex = signal(0);
  pageSize = signal(10);
  isLoading = signal(false);

  searchControl = new FormControl('', { nonNullable: true });
  
  filteredHeroes = computed(() => this.heroes());

  paginatedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredHeroes().slice(start, start + this.pageSize());
  });

  totalHeroes = computed(() => this.filteredHeroes().length);

  ngOnInit(): void {
    this._titleService.setTitle('RIU Frontend | Superheroes');

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        this.pageIndex.set(0);
        this.isLoading.set(true);
        return this._superheroService.search(query);
      }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: heroes => {
        this.heroes.set(heroes);
        this.isLoading.set(false);
      }
    });

    this.isLoading.set(true);
    this._superheroService.getAllHeroes().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe({
      next: heroes => {
        this.heroes.set(heroes);
        this.isLoading.set(false);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  addNewHero() {
    this._router.navigate(['/hero/new']);
  }

  viewHeroDetails(hero: Superhero) {
    this._dialog.open(HeroDetailDialogComponent, {
      data: hero,
      width: '600px',
      panelClass: 'hero-dialog'
    });
  }

  editHero(hero: Superhero) {
    this._router.navigate(['/hero', hero.id]);
  }

  deleteHero(hero: Superhero) {
    this._dialogService.openDeleteConfirm(hero.name).pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(confirmed => {
      if (confirmed) {
        this._superheroService.delete(hero.id).pipe(
          takeUntilDestroyed(this._destroyRef)
        ).subscribe({
          next: () => {
            const updatedHeroes = this.heroes().filter(h => h.id !== hero.id);
            this.heroes.set(updatedHeroes);

            const currentQuery = this.searchControl.value;
            const filteredCount = updatedHeroes.filter(h =>
              h.name.toLowerCase().includes(currentQuery.toLowerCase())
            ).length;

            const maxPage = Math.max(0, Math.ceil(filteredCount / this.pageSize()) - 1);
            if (this.pageIndex() > maxPage) {
              this.pageIndex.set(maxPage);
            }

            this._snackBar.open('Superhero deleted successfully!', 'Close', { duration: 3000 });
          },
          error: () => {
            this._snackBar.open('Could not delete the superhero.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}