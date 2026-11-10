import { apiGet } from './repository/apiClient';
import type { DashboardAsistencia } from '../types/asistencia';

// Dashboard de asistencia con datos reales. naveId = null → todas las naves
export async function obtenerDashboard(fecha: string, naveId: number | null): Promise<DashboardAsistencia | null> {
  const q = new URLSearchParams({ fecha });
  if (naveId !== null) q.append('naveId', String(naveId));
  return apiGet<DashboardAsistencia>(`/api/asistencia/dashboard?${q}`);
}