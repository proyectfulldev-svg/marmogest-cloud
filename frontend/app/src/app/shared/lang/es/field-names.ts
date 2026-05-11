// Diccionario de nombres de campos para mensajes de error del backend.
// El interceptor de errores lo usa para transformar:
//   "El campo material_code es requerido"
// en:
//   "El campo código del material es requerido"
export const FIELD_NAMES: Record<string, string> = {

  // Auth
  email:            'correo electrónico',
  password:         'contraseña',
  passwordConfirm:  'confirmación de contraseña',

  // Material
  material_code:    'código del material',
  material_name:    'nombre del material',
  material_type:    'tipo de material',
  material_finish:  'acabado',
  material_color:   'color',
  material_origin:  'origen',
  unit:             'unidad de medida',
  price_per_unit:   'precio por unidad',
  stock_quantity:   'cantidad en stock',
  min_stock:        'stock mínimo',
  width_cm:         'ancho (cm)',
  height_cm:        'alto (cm)',
  thickness_cm:     'espesor (cm)',
  weight_kg:        'peso (kg)',

  // Proveedor
  supplier_name:    'nombre del proveedor',
  supplier_ruc:     'RUC del proveedor',
  supplier_country: 'país de origen',
  supplier_contact: 'contacto',
  supplier_email:   'correo del proveedor',
  supplier_phone:   'teléfono del proveedor',

  // Cliente
  client_name:      'nombre del cliente',
  client_ruc:       'RUC del cliente',
  client_dni:       'DNI del cliente',
  client_type:      'tipo de cliente',
  client_address:   'dirección',
  client_phone:     'teléfono del cliente',
  client_email:     'correo del cliente',

  // Factura
  invoice_number:   'número de factura',
  invoice_date:     'fecha de emisión',
  due_date:         'fecha de vencimiento',
  currency:         'moneda',
  tax_rate:         'tasa de impuesto',
  notes:            'notas',

  // Orden de compra
  purchase_order_number: 'número de orden de compra',
  delivery_date:    'fecha de entrega',
  quantity:         'cantidad',

  // Usuario
  user_name:        'nombre de usuario',
  user_email:       'correo del usuario',
  user_role:        'rol',
};
