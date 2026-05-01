// src/app/core/interceptors/auth-interceptor.ts
//
// Se ejecuta en CADA petición HTTP que salga de la app.
// Su trabajo: agregar el token de autorización automáticamente.
// Sin esto tendrías que escribir el header en cada llamada al backend.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {StorageService} from '../../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const _storage = inject(StorageService);
  const token = _storage.getItem<string>('access_token');

  // Si hay token, clona la petición y agrega el header Authorization.
  // Se clona porque las peticiones HTTP son inmutables — no se pueden modificar,
  // solo copiar con cambios.
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // Sin token — deja pasar la petición sin modificar (ej: el login)
  return next(req);
};
