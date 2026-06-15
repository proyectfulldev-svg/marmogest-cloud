import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  message: string;
  type: AlertType;
}

@Injectable({ providedIn: 'root' })
export class AlertService {

  readonly alert = signal<Alert | null>(null);

  show(message: string, type: AlertType = 'info'): void {
    this.alert.set({ message, type });
    setTimeout(() => this.alert.set(null), 4000);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void   { this.show(message, 'error'); }
  warning(message: string): void { this.show(message, 'warning'); }
}
