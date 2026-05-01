// src/app/core/guards/auth.guard.ts

/**
 * AuthGuard — Protege rutas que REQUIEREN estar logueado
 *
 * Ejemplo de uso en routes:
 *   { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] }
 *
 * Si el usuario NO está logueado → lo manda al login.
 * Si el usuario SÍ está logueado → lo deja pasar.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const _auth = inject(AuthService);
  const router = inject(Router);

  if (_auth.isLoggedIn()) {
    return true; // ✅ tiene sesión, puede entrar
  }

  // ❌ no tiene sesión, lo mandamos al login
  router.navigateByUrl('/');
  return false;
};
