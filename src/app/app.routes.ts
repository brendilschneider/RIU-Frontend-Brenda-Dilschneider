import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { SuperheroTableComponent } from './dashboard/superheroes/superheroe-table/superhero-table';
import { SuperheroFormComponent } from './dashboard/superheroes/superhero-form/superhero-form';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: SuperheroTableComponent },   
      { path: 'hero/new', component: SuperheroFormComponent },
      { path: 'hero/:id', component: SuperheroFormComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
