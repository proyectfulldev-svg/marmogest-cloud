// src/app/core/guards/no-auth.guard.ts

/**
 * NoAuthGuard — Protege rutas que SOLO son para usuarios SIN sesión
 *
 * Ejemplo: el login. Si ya estás logueado y tratas de ir a /login,
 * te redirige directo al dashboard — no tiene sentido volver a loguearte.
 *
 * Si el usuario SÍ está logueado → lo manda al dashboard.
 * Si el usuario NO está logueado → lo deja ver el login.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const NoAuthGuard: CanActivateFn = () => {
  const _auth = inject(AuthService);
  const router = inject(Router);

  if (_auth.isLoggedIn()) {
    // Ya está logueado, no tiene sentido que vea el login
    router.navigateByUrl('/dashboard');
    return false;
  }

  return true; // ✅ no tiene sesión, puede ver el login
};
