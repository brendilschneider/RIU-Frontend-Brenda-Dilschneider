import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, finalize } from 'rxjs';
import { Superhero } from '../../models/superhero.model';
import { LoadingService } from './loading.service';
import { SUPERHEROES_DATA } from './superheroes.data';

@Injectable({
  providedIn: 'root'
})
export class SuperheroesService {
  private _loadingService = inject(LoadingService);
  private _heroes: Superhero[] = [...SUPERHEROES_DATA];

  getAllHeroes(): Observable<Superhero[]> {
    this._loadingService.show();
    return of([...this._heroes]).pipe(
      delay(300),
      finalize(() => this._loadingService.hide())
    );
  }

  getHeroById(id: number): Observable<Superhero> {
    this._loadingService.show();
    const hero = this._heroes.find(h => h.id === id);
    if (!hero) {
      this._loadingService.hide();
      throw new Error(`Superhero with id ${id} not found`);
    }
    return of(hero).pipe(
      delay(300),
      finalize(() => this._loadingService.hide())
    );
  }

  search(query: string): Observable<Superhero[]> {
    const lowerQuery = query.toLowerCase();
    const filtered = this._heroes.filter(h =>
      h.name.toLowerCase().includes(lowerQuery)
    );
    return of(filtered).pipe(
      delay(200),
      finalize(() => this._loadingService.hide())
    );
  }

  add(hero: Partial<Superhero>): Observable<Superhero> {
    this._loadingService.show();
    const newId = this._heroes.length > 0 ? Math.max(...this._heroes.map(h => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId } as Superhero;
    this._heroes = [...this._heroes, newHero];
    return of(newHero).pipe(
      delay(300),
      finalize(() => this._loadingService.hide())
    );
  }

  update(updated: Superhero): Observable<Superhero> {
    this._loadingService.show();
    this._heroes = this._heroes.map(h =>
      h.id === updated.id ? updated : h
    );
    return of(updated).pipe(
      delay(300),
      finalize(() => this._loadingService.hide())
    );
  }

  delete(id: number): Observable<void> {
    this._loadingService.show();
    this._heroes = this._heroes.filter(h => h.id !== id);
    return of(void 0).pipe(
      delay(300),
      finalize(() => this._loadingService.hide())
    );
  }
}