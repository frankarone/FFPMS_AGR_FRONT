import { apiGet, apiDownload, queryFechas } from './repository/apiClient';
import type { ProductoPedido } from '../types/producto';

export function listarProductosPedidos(desde?: string, hasta?: string) {
  return apiGet<ProductoPedido[]>('/api/reporte/productos-pedidos' + queryFechas(desde, hasta));
}

export function descargarProductosExcel(desde?: string, hasta?: string) {
  return apiDownload('/api/reporte/productos-pedidos/excel' + queryFechas(desde, hasta), 'productos-mas-pedidos.xlsx');
}