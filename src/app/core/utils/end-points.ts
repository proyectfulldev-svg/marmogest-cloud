// src/app/core/utils/end-points.ts
export const enum EndPoints {
  // Auth
  LOGIN         = '/api/auth/login',
  LOGOUT        = '/api/auth/logout',

  // Inventario
  PRODUCTS      = '/api/products',
  PRODUCT_BY_ID = '/api/products/',

  // Proveedores
  SUPPLIERS     = '/api/suppliers',

  // Facturas
  INVOICES      = '/api/invoices',
}
