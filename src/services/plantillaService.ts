import { apiGet, apiPost, apiPut, apiDelete } from './repository/apiClient';
import type { PlantillaNave, PersonaAsistencia, Asignacion, ItemPlantilla } from '../types/asistencia';

// Plantilla de proceso: se guarda en la base de datos (FppmsSistema.dbo.PlantillaProceso)
type Respuesta = { ok: boolean; mensaje: string };

export async function obtenerPlantilla(naveId: number): Promise<PlantillaNave> {
  const p = await apiGet<PlantillaNave>(`/api/plantillas/${naveId}`);
    return p ?? { naveId, items: [], areasGuardadas: [], estimados: {} };
}

// Busca en Registro Personal por DNI exacto o parte del nombre (mínimo 3 caracteres)
export async function buscarPersonalTexto(texto: string): Promise<PersonaAsistencia[]> {
  const t = texto.trim();
  if (t.length < 3) return [];
  return (await apiGet<PersonaAsistencia[]>(`/api/plantillas/personal?texto=${encodeURIComponent(t)}`)) ?? [];
}

export async function buscarPersonalPorDni(dni: string): Promise<PersonaAsistencia | null> {
  const lista = await buscarPersonalTexto(dni);
  return lista.find((p) => p.dni === dni.trim()) ?? null;
}

// ¿En qué nave y área está asignada esta persona? (null = en ninguna)
export async function buscarAsignacion(personalId: number): Promise<Asignacion | null> {
  const l = await apiGet<Asignacion[]>(`/api/plantillas/asignacion/${personalId}`);
  return l && l.length > 0 ? l[0] : null;
}

// Asigna o mueve (una persona solo puede estar en una plantilla)
export async function asignar(naveId: number, personalId: number, areaId: number, desdeAsistencia = false): Promise<Respuesta | null> {
  const q = desdeAsistencia ? '?desdeAsistencia=true' : '';
  return apiPost<Respuesta>(`/api/plantillas/${naveId}/items${q}`, { personalId, areaId });
}

export async function quitarDePlantilla(naveId: number, personalId: number, desdeAsistencia = false): Promise<Respuesta | null> {
  const q = desdeAsistencia ? '?desdeAsistencia=true' : '';
  return apiDelete<Respuesta>(`/api/plantillas/${naveId}/items/${personalId}${q}`);
}

export async function guardarAreaPlantilla(naveId: number, areaId: number): Promise<Respuesta | null> {
  return apiPost<Respuesta>(`/api/plantillas/${naveId}/areas/${areaId}/guardar`, {});
}

export async function editarAreaPlantilla(naveId: number, areaId: number): Promise<Respuesta | null> {
  return apiDelete<Respuesta>(`/api/plantillas/${naveId}/areas/${areaId}/guardar`);
}

export async function guardarEstimado(naveId: number, areaId: number, totalEstimado: number): Promise<Respuesta | null> {
  return apiPut<Respuesta>(`/api/plantillas/${naveId}/areas/${areaId}/estimado`, { totalEstimado });
}

// --- Usadas por ASISTENCIA AGR: actualizan la plantilla aunque el área esté guardada ---
function avisarSiFalla(r: Respuesta | null) {
  if (!r?.ok) {
    window.alert(`La asistencia de hoy se actualizó, pero la PLANTILLA no: ${r?.mensaje ?? 'error de conexión'}`);
  }
}

export async function asignarEnPlantilla(naveId: number, item: ItemPlantilla): Promise<void> {
  avisarSiFalla(await asignar(naveId, item.personalId, item.areaId, true));
}

export async function quitarDeTodasLasPlantillas(personalId: number): Promise<void> {
  const a = await buscarAsignacion(personalId);
  if (a) avisarSiFalla(await quitarDePlantilla(a.naveId, personalId, true));
}