import { Routes } from '@angular/router';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { AuthGuard } from './core/guards/auth-guard';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/login/login').then(m => m.Login),
    canActivate: [NoAuthGuard]
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./modules/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'inventory',
        loadComponent: () => import('./modules/inventory/inventory').then(m => m.Inventory),
      },
      {
        path: 'invoices',
        loadComponent: () => import('./modules/invoices/invoice-list/invoice-list').then(m => m.InvoiceList),
      },
      {
        path: 'invoices/create',
        loadComponent: () => import('./modules/invoices/create-invoice/create-invoice').then(m => m.CreateInvoice),
      },
      {
        path: 'invoices/:id',
        loadComponent: () => import('./modules/invoices/invoice-details/invoice-details').then(m => m.InvoiceDetails),
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./modules/suppliers/list-of-suppliers/list-of-suppliers').then(m => m.ListOfSuppliers),
      },
      {
        path: 'suppliers/purchase-orders',
        loadComponent: () => import('./modules/suppliers/purchase-orders/purchase-orders').then(m => m.PurchaseOrders),
      },
      {
        path: 'statistics',
        loadComponent: () => import('./modules/statistics/statistics').then(m => m.Statistics),
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
