import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { CreateInvoice } from '../invoices/create-invoice/create-invoice';

// ── Interfaces ────────────────────────────────────────────────

interface StatCard {
  label:     string;
  value:     string;
  icon:      string;
  iconClass: 'icon-primary' | 'icon-success' | 'icon-warning' | 'icon-danger';
  trend:     string;
  trendUp:   boolean;
}

interface RecentInvoice {
  number: string;
  client: string;
  amount: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'DRAFT';
  date:   string;
}

interface LowStockItem {
  name:    string;
  current: number;
  min:     number;
  unit:    string;
  percent: number;
  level:   'high' | 'medium' | 'low';
}

interface TopMaterial {
  rank:    number;
  name:    string;
  sold:    string;
  revenue: string;
}

interface ActivityItem {
  text: string;
  time: string;
}

// ── Componente ────────────────────────────────────────────────

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly _dialog = inject(MatDialog);

  openCreateInvoice(): void {
    this._dialog.open(CreateInvoice, { panelClass: 'modal-lg', width: '860px' });
  }


  readonly today = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // ── Stat cards ──────────────────────────────────────────────
  readonly statCards: StatCard[] = [
    {
      label: 'Materiales en catálogo', value: '342',
      icon: 'inventory_2', iconClass: 'icon-primary',
      trend: '+12 este mes', trendUp: true,
    },
    {
      label: 'Stock total (m²)', value: '1,840 m²',
      icon: 'square_foot', iconClass: 'icon-success',
      trend: '-48 m² esta semana', trendUp: false,
    },
    {
      label: 'Ventas del mes', value: 'S/ 48,200',
      icon: 'payments', iconClass: 'icon-warning',
      trend: '+18% vs mes anterior', trendUp: true,
    },
    {
      label: 'Facturas pendientes', value: '8',
      icon: 'receipt_long', iconClass: 'icon-danger',
      trend: '3 vencidas', trendUp: false,
    },
  ];

  // ── Últimas facturas ────────────────────────────────────────
  readonly recentInvoices: RecentInvoice[] = [
    { number: '#F-0041', client: 'Juan Pérez',       amount: 'S/ 3,200', status: 'PAID',    date: '08/05/2026' },
    { number: '#F-0040', client: 'Arq. Lima & Asoc', amount: 'S/ 8,750', status: 'PENDING', date: '07/05/2026' },
    { number: '#F-0039', client: 'Construx SAC',     amount: 'S/ 1,900', status: 'OVERDUE', date: '01/05/2026' },
    { number: '#F-0038', client: 'Mármoles del Sur', amount: 'S/ 5,400', status: 'PAID',    date: '28/04/2026' },
    { number: '#F-0037', client: 'Diseños Modernos', amount: 'S/ 2,100', status: 'DRAFT',   date: '25/04/2026' },
  ];

  // ── Stock bajo ──────────────────────────────────────────────
  readonly lowStock: LowStockItem[] = [
    { name: 'Nero Marquina',  current: 12, min: 50, unit: 'm²', percent: 24, level: 'low'    },
    { name: 'Thassos White',  current: 8,  min: 40, unit: 'm²', percent: 20, level: 'low'    },
    { name: 'Verde Guatemala',current: 25, min: 60, unit: 'm²', percent: 42, level: 'medium' },
    { name: 'Botticino',      current: 18, min: 40, unit: 'm²', percent: 45, level: 'medium' },
  ];

  // ── Top materiales ──────────────────────────────────────────
  readonly topMaterials: TopMaterial[] = [
    { rank: 1, name: 'Bianco Carrara', sold: '320 m²', revenue: 'S/ 16,000' },
    { rank: 2, name: 'Crema Marfil',   sold: '280 m²', revenue: 'S/ 11,200' },
    { rank: 3, name: 'Granito Negro',  sold: '210 m²', revenue: 'S/ 10,500' },
    { rank: 4, name: 'Travertino',     sold: '185 m²', revenue: 'S/  7,400' },
    { rank: 5, name: 'Ónix Miel',      sold: '140 m²', revenue: 'S/  9,800' },
  ];

  // ── Actividad reciente ──────────────────────────────────────
  readonly activity: ActivityItem[] = [
    { text: 'Nueva factura #F-0041 creada para Juan Pérez',         time: 'hace 2 h'  },
    { text: 'Stock de Nero Marquina actualizado — 12 m² restantes', time: 'hace 4 h'  },
    { text: 'Orden de compra #OC-018 enviada a Proveedor Italia',   time: 'hace 6 h'  },
    { text: 'Factura #F-0039 marcada como vencida',                 time: 'ayer'      },
    { text: 'Ingresaron 200 m² de Bianco Carrara al almacén',       time: 'hace 2 d'  },
  ];

  // ── Helper: clase CSS del badge según estado ────────────────
  badgeClass(status: RecentInvoice['status']): string {
    const map: Record<string, string> = {
      PAID: 'badge-paid', PENDING: 'badge-pending',
      OVERDUE: 'badge-overdue', DRAFT: 'badge-draft',
    };
    return `badge ${map[status]}`;
  }

  badgeLabel(status: RecentInvoice['status']): string {
    const map: Record<string, string> = {
      PAID: 'Pagada', PENDING: 'Pendiente', OVERDUE: 'Vencida', DRAFT: 'Borrador',
    };
    return map[status];
  }
}
