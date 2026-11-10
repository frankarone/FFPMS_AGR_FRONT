import { apiGet } from './repository/apiClient';
import type { NaveProceso, AreaProceso } from '../types/asistencia';

// Catálogos reales (backend) + copia en memoria para obtener nombres por id
let naves: NaveProceso[] = [];
let areas: AreaProceso[] = [];

export async function listarNavesProceso(): Promise<NaveProceso[]> {
  naves = (
    await apiGet<NaveProceso[]>('/api/naves-proceso'))
     ?? [];
  return naves;
}

export async function listarAreasProceso(): Promise<AreaProceso[]> {
  areas = (
    await apiGet<AreaProceso[]>('/api/areas-proceso'))
     ?? [];
  return areas;
}

export const nombreNave = 
    (id: number) => 
        naves.find((n) => n.id === id)?.nombre ?? `NAVE ${id}`;
export const nombreArea = 
    (id: number) => 
        areas.find((a) => a.id === id)?.nombre ?? `ÁREA ${id}`;