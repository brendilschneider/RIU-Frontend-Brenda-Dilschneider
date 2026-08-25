import { Component, signal } from '@angular/core';
import { Superhero } from '../models/superhero.model';

@Component({
  imports: [],
  standalone: true,
  selector: 'app-dashboard',
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html',
})
export class DashboardComponent {

  heroes = signal<Superhero[]>([]);

}
