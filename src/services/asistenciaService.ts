import { apiGet, apiDownload } from './repository/apiClient';
import type { DashboardAsistencia, ReporteAsistencia } from '../types/asistencia';

// Dashboard de asistencia con datos reales. naveId = null → todas las naves
export async function obtenerDashboard(fecha: string, naveId: number | null): Promise<DashboardAsistencia | null> {
  const q = new URLSearchParams({ fecha });
  if (naveId !== null) q.append('naveId', String(naveId));
  return apiGet<DashboardAsistencia>(`/api/asistencia/dashboard?${q}`);
}

// VER ASISTENCIA: reporte de una nave en un día
export async function obtenerReporte(fecha: string, naveId: number): Promise<ReporteAsistencia | null> {
  return apiGet<ReporteAsistencia>(`/api/asistencia/reporte?fecha=${fecha}&naveId=${naveId}`);
}

export async function descargarReporteExcel(fecha: string, naveId: number): Promise<boolean> {
  return apiDownload(
    `/api/asistencia/reporte/excel?fecha=${fecha}&naveId=${naveId}`,
    `asistencia-${fecha}-nave${naveId}.xlsx`,
  );
}