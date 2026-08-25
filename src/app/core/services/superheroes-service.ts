import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Superhero } from '../../models/superhero.model';
import { Observable } from 'rxjs';

@Service()
export class SuperheroesService {

  private http = inject(HttpClient);
  private apiUrl = 'https://akabab.github.io/superhero-api/api';

  getAllHeroes(): Observable<Superhero[]> {
    return this.http.get<Superhero[]>(`${this.apiUrl}/all.json`);
  }

  getHeroById(id: number): Observable<Superhero> {
    return this.http.get<Superhero>(`${this.apiUrl}/id/${id}.json`);
  }

}
