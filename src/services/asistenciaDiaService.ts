import { apiGet, apiPost, apiDelete } from './repository/apiClient';
import type {
  AsistenciaNaveDia, ItemAsistencia, PersonaAsistencia, PersonaBase, UbicacionHoy, EstadoAsistencia,
} from '../types/asistencia';
import { buscarPersonalTexto } from './plantillaService';

// Asistencia del día: se guarda en la base de datos (FppmsSistema.dbo.AsistenciaProceso).
// Las reglas (sincronizar con la plantilla, cupos, mover, reemplazar) las aplica el backend.
type Respuesta = { ok: boolean; mensaje: string };

export const MOTIVOS_INASISTENCIA = ['FALTA', 'PERMISO', 'DESCANSO MÉDICO', 'VACACIONES', 'OTRO'];

// null si salió bien; si no, el mensaje de error del backend
const mensajeError = (r: Respuesta | null) => (r?.ok ? null : r?.mensaje ?? 'Error de conexión con el servidor');
const base = (fecha: string, naveId: number) => `/api/asistencia/${fecha}/${naveId}`;

// Personas que ocupan un puesto en el área (los ausentes NO cuentan)
export function activos(r: AsistenciaNaveDia, areaId: number): number {
  return r.items.filter((i) => i.areaId === areaId && i.estado !== 'AUSENTE').length;
}

// Máximo de personas activas en el área (TOTAL ESTIMADO)
export function cupo(r: AsistenciaNaveDia, areaId: number): number {
  return r.cupos?.[areaId] ?? 0;
}

// Abre la asistencia de hoy de una nave (el backend la sincroniza con la plantilla)
export async function obtenerAsistenciaDia(fecha: string, naveId: number): Promise<AsistenciaNaveDia> {
  const a = await apiGet<AsistenciaNaveDia>(base(fecha, naveId));
  return a ?? { fecha, naveId, items: [], areasGuardadas: [], cupos: {} };
}

export async function buscarPersonal(texto: string): Promise<PersonaAsistencia[]> {
  return buscarPersonalTexto(texto);
}

export async function ubicacionHoy(fecha: string, personalId: number): Promise<UbicacionHoy | null> {
  const l = await apiGet<UbicacionHoy[]>(`/api/asistencia/${fecha}/ubicacion/${personalId}`);
  return l && l.length > 0 ? l[0] : null;
}

export async function marcarPresente(fecha: string, naveId: number, personalId: number): Promise<string | null> {
  return mensajeError(await apiPost<Respuesta>(`${base(fecha, naveId)}/presente/${personalId}`, {}));
}

export async function marcarInasistencia(fecha: string, naveId: number, personalId: number, motivo: string): Promise<string | null> {
  return mensajeError(await apiPost<Respuesta>(`${base(fecha, naveId)}/inasistencia/${personalId}`, { motivo }));
}

// Si tenía reemplazo, el backend también lo deshace
export async function quitarInasistencia(fecha: string, naveId: number, item: ItemAsistencia): Promise<string | null> {
  return mensajeError(await apiDelete<Respuesta>(`${base(fecha, naveId)}/inasistencia/${item.personalId}`));
}

export async function guardarAreaAsistencia(fecha: string, naveId: number, areaId: number): Promise<string | null> {
  return mensajeError(await apiPost<Respuesta>(`${base(fecha, naveId)}/areas/${areaId}/guardar`, {}));
}

export async function editarAreaAsistencia(fecha: string, naveId: number, areaId: number): Promise<string | null> {
  return mensajeError(await apiDelete<Respuesta>(`${base(fecha, naveId)}/areas/${areaId}/guardar`));
}

// estado = 'PRESENTE' cuando se escaneó o ya estaba presente; el backend decide el estado final
export async function moverPersona(
  fecha: string, persona: PersonaBase, destinoNaveId: number, destinoAreaId: number, estado: EstadoAsistencia,
): Promise<string | null> {
  return mensajeError(await apiPost<Respuesta>(`/api/asistencia/${fecha}/mover`, {
    personalId: persona.personalId, naveId: destinoNaveId, areaId: destinoAreaId, escaneado: estado === 'PRESENTE',
  }));
}

export async function reemplazar(
  fecha: string, naveId: number, original: ItemAsistencia, persona: PersonaBase, motivo: string, servis: boolean,
): Promise<string | null> {
  return mensajeError(await apiPost<Respuesta>(`${base(fecha, naveId)}/reemplazar/${original.personalId}`, {
    reemplazoId: persona.personalId, motivo, servis,
  }));
}

export async function deshacerReemplazo(fecha: string, naveId: number, item: ItemAsistencia): Promise<string | null> {
  return mensajeError(await apiDelete<Respuesta>(`${base(fecha, naveId)}/reemplazo/${item.personalId}`));
}