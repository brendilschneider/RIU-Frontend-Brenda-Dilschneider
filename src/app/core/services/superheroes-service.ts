import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Superhero } from '../../models/superhero.model';
import { catchError, Observable, of, tap } from 'rxjs';

@Service()
export class SuperheroesService {

  private http = inject(HttpClient);
  private apiUrl = 'https://akabab.github.io/superhero-api/api';

  private heroes: Superhero[] = [];
  
  loadAll(): Observable<Superhero[]> {
    return this.http.get<Superhero[]>(`${this.apiUrl}/all.json`).pipe(
      tap(heroes => this.heroes = heroes),
      catchError(() => of([]))
    );
  }

  getAllHeroes(): Observable<Superhero[]> {
    return this.heroes.length > 0
      ? of(this.heroes)
      : this.loadAll();
  }

  getHeroById(id: number): Observable<Superhero> {
    return this.http.get<Superhero>(`${this.apiUrl}/id/${id}.json`);
  }
  
  search(query: string): Observable<Superhero[]> {
    return of(
      this.heroes.filter(h =>
        h.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }

  add(hero: Omit<Superhero, 'id'>): Observable<Superhero> {
    const newId = Math.max(...this.heroes.map(h => h.id), 0) + 1;
    const newHero = { ...hero, id: newId } as Superhero;
    this.heroes = [...this.heroes, newHero];
    return of(newHero);
  }

  update(updated: Superhero): Observable<Superhero> {
    this.heroes = this.heroes.map(h =>
      h.id === updated.id ? updated : h
    );
    return of(updated);
  }

  delete(id: number): Observable<void> {
    this.heroes = this.heroes.filter(h => h.id !== id);
    return of(void 0);
  }

}
