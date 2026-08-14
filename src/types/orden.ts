export interface Orden {
  numero: string;
  fechaEmitido: string;
  proveedor: string;
  estadoFactura: string;
  nroFactura: string | null;
}

export interface OrdenCabecera {
  numero: string;
  fechaEmitido: string;
  proveedor: string;
  ruc: string;
  moneda: string;
}

export interface OrdenItem {
  producto: string;
  unidad: string;
  cantidad: number;
  precio: number;
  total: number;
}

export interface Factura {
  nroFactura: string;
  fechaFactura: string | null;
  nroGuia: string;
}

export interface DetalleOrden {
  orden: OrdenCabecera;
  items: OrdenItem[];
  facturas: Factura[];
  tieneFactura: boolean;
  neto: number;
  igv: number;
  total: number;
}