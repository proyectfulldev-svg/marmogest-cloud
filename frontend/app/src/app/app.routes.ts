import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import {AuthGuard} from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login').then(m => m.Login),
    canActivate: [NoAuthGuard] // Solo entra si NO está logueado
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AuthGuard] // Solo entra si SÍ está logueado
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
