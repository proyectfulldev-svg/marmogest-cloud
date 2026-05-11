import { Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';

// Gestiona el título del navegador y los datos del header de la app:
//   - título del módulo activo (topbar)
//   - nombre del usuario logueado
//   - imagen de perfil
@Injectable({ providedIn: 'root' })
export class TitleService {

  readonly moduleTitle$ = signal('');
  readonly userName$    = signal('');
  readonly userAvatar$  = signal('');
  readonly showActions$ = signal(false);

  private readonly APP_NAME = 'Marmogest';

  constructor(private title: Title) {}

  setModuleTitle(title: string): void {
    this.moduleTitle$.set(title);
    this.title.setTitle(`${this.APP_NAME} — ${title}`);
  }

  setUserName(name: string): void    { this.userName$.set(name); }
  setUserAvatar(url: string): void   { this.userAvatar$.set(url); }
  showBarActions(show: boolean): void{ this.showActions$.set(show); }
}
