import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

// Spinner de pantalla completa que se muestra/oculta con LoadingService.
// Se coloca una sola vez en app.html y reacciona al BehaviorSubject.
// Ejemplo en app.html:
//   <app-loading />
//   <router-outlet />
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [AsyncPipe, MatProgressSpinnerModule],
  template: `
    @if (loadingService.loading$ | async) {
      <div class="loading-overlay">
        <div class="loading-card">
          <mat-spinner diameter="48" />
          <span>Cargando...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000;
    }
    .loading-card {
      background: #fff;
      border-radius: 12px;
      padding: 32px 40px;
      display: flex; flex-direction: column;
      align-items: center; gap: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      font-size: 14px; color: #555;
    }
  `],
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
