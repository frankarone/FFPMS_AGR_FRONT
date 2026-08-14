import { apiGet, apiDownload, queryFechas } from './repository/apiClient';
import type { Vale } from '../types/vale';

export function listarVales(desde?: string, hasta?: string) {
  return apiGet<Vale[]>('/api/vales' + queryFechas(desde, hasta));
}

export function descargarValePdf(numero: string) {
  return apiDownload(`/api/vale/${encodeURIComponent(numero)}/pdf`, `vale-${numero}.pdf`);
}