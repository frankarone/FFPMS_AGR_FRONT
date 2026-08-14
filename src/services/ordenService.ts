import { apiGet, apiDownload, queryFechas } from './repository/apiClient';
import type { Orden, DetalleOrden } from '../types/orden';

export function listarOrdenes(desde?: string, hasta?: string) {
  return apiGet<Orden[]>('/api/ordenes' + queryFechas(desde, hasta));
}

export function detalleOrden(numero: string) {
  return apiGet<DetalleOrden>(`/api/orden/${encodeURIComponent(numero)}`);
}

export function descargarOrdenPdf(numero: string) {
  return apiDownload(`/api/orden/${encodeURIComponent(numero)}/pdf`, `orden-${numero}.pdf`);
}