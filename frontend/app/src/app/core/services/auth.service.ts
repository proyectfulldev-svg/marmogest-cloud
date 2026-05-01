// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { StorageService } from './storage.service';
import {AuthLogin, AuthResponse, AuthUser} from '../interfaces/http-options.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  // Credenciales de prueba — cuando tengas backend las eliminas
  private readonly MOCK_EMAIL    = 'admin@marmogest.com';
  private readonly MOCK_PASSWORD = '123456';

  constructor(
    private _storage: StorageService,
    private router: Router
  ) {}

  /**
   * login() simulado — imita lo que haría una llamada real al backend.
   *
   * of() crea un Observable con un valor fijo — como si el backend respondiera.
   * delay(800) simula el tiempo de respuesta de red (800ms).
   * throwError() simula un error del backend cuando las credenciales son incorrectas.
   *
   * Cuando tengas backend: reemplaza todo esto por:
   * return this._http.post<AuthLogin, AuthResponse>(EndPoints.LOGIN, credentials).pipe(
   *   tap(response => this.saveSession(response))
   * );
   */
  login(credentials: AuthLogin): Observable<AuthResponse> {
    const { email, password } = credentials;

    if (email === this.MOCK_EMAIL && password === this.MOCK_PASSWORD) {
      const mockResponse: AuthResponse = {
        access_token: 'mock-token-xyz-123',
        user: {
          id: '1',
          name: 'Administrador',
          email: email,
          role: 'admin'
        }
      };

      // Guardamos la sesión y devolvemos el observable con delay
      this.saveSession(mockResponse);
      return of(mockResponse).pipe(delay(800));
    }

    // Credenciales incorrectas — devuelve un error como haría el backend
    return throwError(() => ({
      status: 401,
      message: 'Correo o contraseña incorrectos'
    }));
  }

  /**
   * saveSession() — guarda token y usuario en localStorage.
   * Método privado porque solo lo usa este servicio.
   * Separado para que cuando conectes el backend real
   * solo llames this.saveSession(response) desde el tap().
   */
  private saveSession(response: AuthResponse): void {
    this._storage.setItem('access_token', response.access_token);
    this._storage.setItem('user', response.user);
  }

  /** Devuelve true si hay token guardado — lo usan los Guards */
  isLoggedIn(): boolean {
    const token = this._storage.getItem<string>('access_token');
    return token !== null && token !== '';
  }

  /** Devuelve el usuario guardado — útil para el header */
  getUser(): AuthUser | null {
    return this._storage.getItem<AuthUser>('user');
  }

  /** Borra la sesión y redirige al login */
  logout(): void {
    this._storage.removeAll();
    this.router.navigateByUrl('/');
  }
}
