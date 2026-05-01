// src/app/core/services/auth.service.ts

/**
 * AuthService — Maneja todo lo relacionado con autenticación
 *
 * Sigue el principio de responsabilidad única (SRP):
 * este servicio SOLO sabe de login, logout y estado de sesión.
 * No sabe nada de productos, facturas, etc. — eso va en otros servicios.
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { EndPoints } from '../utils/end-points';
import {AuthLogin, AuthResponse, AuthUser} from '../interfaces/http-options.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(
    private _http: HttpService,
    private _storage: StorageService,
    private router: Router
  ) {}

  /**
   * login() — Envía credenciales al backend
   *
   * Devuelve un Observable — el componente hace .subscribe() para
   * reaccionar cuando llega la respuesta.
   *
   * El operador tap() ejecuta código "de lado" sin modificar la respuesta:
   * úsalo para guardar el token cuando el login es exitoso.
   */
  login(credentials: AuthLogin): Observable<AuthResponse> {
    return this._http.post<AuthLogin, AuthResponse>(EndPoints.LOGIN, credentials).pipe(
      tap((response: AuthResponse) => {
        // tap se ejecuta cuando el backend responde con éxito.
        // Guardamos el token y el usuario en localStorage.
        this._storage.setItem('access_token', response.access_token);
        this._storage.setItem('user', response.user);
      })
    );
  }

  /**
   * isLoggedIn() — Verifica si hay una sesión activa
   *
   * Los Guards usan este método para decidir si dejar pasar o redirigir.
   * Por ahora verifica solo que el token exista — más adelante
   * podrías verificar también que no esté vencido.
   */
  isLoggedIn(): boolean {
    const token = this._storage.getItem<string>('access_token');
    return token !== null && token !== '';
  }

  /**
   * getUser() — Devuelve el usuario guardado en sesión
   *
   * Útil para mostrar el nombre en el header, verificar el rol, etc.
   */
  getUser(): AuthUser | null {
    return this._storage.getItem<AuthUser>('user');
  }

  /**
   * logout() — Limpia la sesión y redirige al login
   *
   * removeAll() borra TODO el localStorage.
   * Luego redirige a '/' que está configurado para ir al login.
   */
  logout(): void {
    this._storage.removeAll();
    this.router.navigateByUrl('/');
  }
}
