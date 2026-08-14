export interface ProductoPedido {
  codigo: string;
  producto: string;
  unidad: string;
  solicitante: string;
  destino: string;
  totalCantidad: number;
  nroOrdenes: number;
  montoTotal: number;
}