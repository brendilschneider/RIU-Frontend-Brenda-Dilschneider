import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      { 
        path: '', 
        loadComponent: () => import('./dashboard/superheroes/superheroe-table/superhero-table').then(m => m.SuperheroTableComponent) 
      },  
      { 
        path: 'hero/new', 
        loadComponent: () => import('./dashboard/superheroes/superhero-form/superhero-form').then(m => m.SuperheroFormComponent) 
      },
      { 
        path: 'hero/:id', 
        loadComponent: () => import('./dashboard/superheroes/superhero-form/superhero-form').then(m => m.SuperheroFormComponent) 
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];