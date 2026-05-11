import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/interfaces/http-options.interface';

interface NavItem {
  label: string;
  icon:  string;
  route: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {

  collapsed = signal(false);

  readonly user: AuthUser | null;

  readonly navGroups: NavGroup[] = [
    {
      label: 'Principal',
      items: [
        { label: 'Dashboard',    icon: 'dashboard',     route: '/dashboard'   },
      ],
    },
    {
      label: 'Gestión',
      items: [
        { label: 'Inventario',   icon: 'inventory_2',   route: '/inventory'   },
        { label: 'Facturas',     icon: 'receipt_long',  route: '/invoices'    },
        { label: 'Proveedores',  icon: 'local_shipping', route: '/suppliers'  },
      ],
    },
    {
      label: 'Reportes',
      items: [
        { label: 'Estadísticas', icon: 'bar_chart',     route: '/statistics'  },
      ],
    },
  ];

  constructor(private _auth: AuthService) {
    this.user = this._auth.getUser();
  }

  toggle(): void {
    this.collapsed.update(v => !v);
  }

  logout(): void {
    this._auth.logout();
  }

  get initials(): string {
    if (!this.user?.name) return '?';
    return this.user.name
      .split(' ')
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }
}
