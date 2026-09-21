import { apiGet, apiDownload } from './repository/apiClient';
import type { ReportePersonalFila } from '../types/personal';

export interface FiltrosReporte {
  campoFecha?: string;
  desde?: string;
  hasta?: string;
  areaId?: number | null;
  tipoPersonalId?: number | null;
  estado?: string;
}

function query(f: FiltrosReporte): string {
  const p = new URLSearchParams();
  if (f.campoFecha) p.append('campoFecha', f.campoFecha);
  if (f.desde) p.append('desde', f.desde);
  if (f.hasta) p.append('hasta', f.hasta);
  if (f.areaId) p.append('areaId', String(f.areaId));
  if (f.tipoPersonalId) p.append('tipoPersonalId', String(f.tipoPersonalId));
  if (f.estado) p.append('estado', f.estado);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export function listarReportePersonal(f: FiltrosReporte) {
  return apiGet<ReportePersonalFila[]>('/api/reporte/personal' + query(f));
}
export function descargarReportePersonalExcel(f: FiltrosReporte) {
  return apiDownload('/api/reporte/personal/excel' + query(f), 'reporte-personal.xlsx');
}