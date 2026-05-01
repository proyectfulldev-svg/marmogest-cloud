// src/app/core/interceptors/http-error.interceptor.ts
//
// Se ejecuta cuando el backend devuelve un error.
// Su trabajo: manejar los errores HTTP en un solo lugar.
// Sin esto tendrías que manejar errores 401, 403, 500 en cada componente.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {StorageService} from '../../services/storage.service';


export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const _storage = inject(StorageService);

  return next(req).pipe(
    catchError((error) => {

      switch (error.status) {

        case 401:
          // Token vencido o inválido — cierra sesión y manda al login
          _storage.removeAll();
          router.navigateByUrl('/');
          break;

        case 403:
          // Sin permiso para esa acción
          console.warn('Sin permisos para esta acción');
          break;

        case 404:
          // Recurso no encontrado
          console.warn('Recurso no encontrado:', req.url);
          break;

        case 500:
          // Error del servidor
          console.error('Error interno del servidor');
          break;
      }

      // Siempre relanza el error para que el componente también pueda reaccionar
      return throwError(() => error);
    })
  );
};
