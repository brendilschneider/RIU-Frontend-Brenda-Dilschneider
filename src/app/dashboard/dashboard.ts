import { Component, signal } from '@angular/core';
import { SuperheroTableComponent } from './superheroes/superheroe-table/superhero-table';

@Component({
  standalone: true,
  imports: [
    SuperheroTableComponent
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class DashboardComponent { }
