import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Controla dos estados de carga:
//   loading$      → spinner de pantalla completa (operaciones largas)
//   loadingTable$ → spinner dentro de la tabla (solo recarga de datos)
@Injectable({ providedIn: 'root' })
export class LoadingService {

  readonly loading$      = new BehaviorSubject<boolean>(false);
  readonly loadingTable$ = new BehaviorSubject<boolean>(false);

  show(): void {
    this.loading$.next(true);
    document.documentElement.classList.add('no-scroll');
  }

  hide(): void {
    setTimeout(() => {
      this.loading$.next(false);
      document.documentElement.classList.remove('no-scroll');
    }, 300);
  }

  showTable(): void  { this.loadingTable$.next(true); }
  hideTable(): void  { setTimeout(() => this.loadingTable$.next(false), 300); }
}
