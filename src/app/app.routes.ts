import { Routes } from '@angular/router';
import { HomeView } from '../views/home.view';
import { MateriaView } from '../views/materia.view';

export const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: HomeView },
  { path: 'trabajo-social/evaluacion', component: MateriaView },
  { path: ':carreraId/evaluacion', component: MateriaView }
];
