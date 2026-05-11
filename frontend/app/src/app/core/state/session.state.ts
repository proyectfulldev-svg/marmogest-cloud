import { signal } from '@angular/core';

// Signals globales para el estado de sesión.
// Se usan para evitar que el interceptor muestre el alert de "sesión expirada"
// más de una vez cuando hay múltiples peticiones fallidas al mismo tiempo.
export const sessionExpiredAlertShown    = signal(false);
export const sessionExpiredAlertShownTwo = signal(false);
