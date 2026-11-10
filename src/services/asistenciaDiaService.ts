import type {
  AsistenciaNaveDia, ItemAsistencia, ItemPlantilla, PersonaAsistencia, PersonaBase, UbicacionHoy, EstadoAsistencia,
} from '../types/asistencia';
import { nombreNave, nombreArea } from './catalogoProcesoService';
import { obtenerPlantilla, buscarAsignacion, asignarEnPlantilla, quitarDeTodasLasPlantillas, buscarPersonalTexto } from './plantillaService';

// MODO LOCAL: la asistencia de cada día y nave se guarda en el navegador (localStorage).
// Al conectar el backend, TODA esta lógica (sincronizar con la plantilla, cupos,
// mover y reemplazar) la hará el servidor y aquí solo quedarán llamadas a la API.
const CLAVE = 'ffpms.asistencia.dias';

export const MOTIVOS_INASISTENCIA = ['FALTA', 'PERMISO', 'DESCANSO MÉDICO', 'VACACIONES', 'OTRO'];

function leerTodas(): Record<string, AsistenciaNaveDia> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) || '{}');
  } catch {
    return {};
  }
}

function escribirTodas(todas: Record<string, AsistenciaNaveDia>) {
  localStorage.setItem(CLAVE, JSON.stringify(todas));
}

const clave = (fecha: string, naveId: number) => `${fecha}|${naveId}`;
const nombreDe = (p: PersonaBase) => `${p.apellidos} ${p.nombres}`;

function leerDia(fecha: string, naveId: number): AsistenciaNaveDia | null {
  return leerTodas()[clave(fecha, naveId)] ?? null;
}

function escribirDia(a: AsistenciaNaveDia) {
  const todas = leerTodas();
  todas[clave(a.fecha, a.naveId)] = a;
  escribirTodas(todas);
}

function itemPlantilla(p: PersonaBase, areaId: number): ItemPlantilla {
  return { personalId: p.personalId, dni: p.dni, nombres: p.nombres, apellidos: p.apellidos, areaId, area: nombreArea(areaId) };
}

function nuevoItem(p: PersonaBase, areaId: number, estado: EstadoAsistencia, extra: Partial<ItemAsistencia> = {}): ItemAsistencia {
  return {
    ...itemPlantilla(p, areaId),
    estado,
    motivo: null,
    servis: false,
    esReemplazo: false,
    reemplazaA: null,
    reemplazadoPor: null,
    movidoDe: null,
    ...extra,
  };
}

// Personas que ocupan un puesto en el área (los ausentes NO cuentan)
export function activos(r: AsistenciaNaveDia, areaId: number): number {
  return r.items.filter((i) => i.areaId === areaId && i.estado !== 'AUSENTE').length;
}

// Máximo de personas activas en el área (según la plantilla)
export function cupo(r: AsistenciaNaveDia, areaId: number): number {
  return r.cupos?.[areaId] ?? 0;
}

// Arma la asistencia del día o la SINCRONIZA con la plantilla actual de la nave
export async function obtenerAsistenciaDia(fecha: string, naveId: number): Promise<AsistenciaNaveDia> {
  const plantilla = await obtenerPlantilla(naveId);
  const r: AsistenciaNaveDia = leerDia(fecha, naveId) ?? { fecha, naveId, items: [], areasGuardadas: [], cupos: {} };
  r.cupos = r.cupos ?? {};
  const enPlantilla = new Set(plantilla.items.map((i) => i.personalId));

  // 1) Quien salió de la plantilla y todavía no se marcó, sale de la asistencia
  r.items = r.items.filter((i) => i.estado !== 'PENDIENTE' || enPlantilla.has(i.personalId));

  // 2) Quien está en la plantilla y falta aquí, aparece sin marcar
  for (const p of plantilla.items) {
    const existente = r.items.find((i) => i.personalId === p.personalId);
    if (!existente) {
      r.items.push(nuevoItem(p, p.areaId, 'PENDIENTE'));
    } else if (existente.estado === 'PENDIENTE' || existente.reemplazadoPor !== null) {
      // pendiente que cambió de área, o persona reemplazada que se volvió a poner en la plantilla
      existente.areaId = p.areaId;
      existente.area = p.area;
      if (existente.reemplazadoPor !== null) {
        existente.estado = 'PENDIENTE';
        existente.motivo = null;
        existente.reemplazadoPor = null;
      }
    }
  }

  // 3) Cupos: el TOTAL ESTIMADO de la plantilla (si lo cambias, se actualiza al recargar).
  //    Si un área aún no tiene estimado, se usa lo que había (no baja durante el día).
  const estimados = plantilla.estimados ?? {};
  for (const [areaId, total] of Object.entries(estimados)) {
    r.cupos[Number(areaId)] = total;
  }
  for (const i of r.items) {
    if (estimados[i.areaId] === undefined) {
      r.cupos[i.areaId] = Math.max(r.cupos[i.areaId] ?? 0, activos(r, i.areaId));
    }
  }

  escribirDia(r);
  return r;
}

export async function guardarAsistenciaDia(a: AsistenciaNaveDia): Promise<void> {
  escribirDia(a);
}

// Busca por DNI exacto (escrito o escaneado) o por parte del nombre
export async function buscarPersonal(texto: string): Promise<PersonaAsistencia[]> {
  return buscarPersonalTexto(texto);
}

// ¿Dónde está esta persona HOY? Primero en la asistencia ya abierta, si no en las plantillas
export async function ubicacionHoy(fecha: string, personalId: number): Promise<UbicacionHoy | null> {
  for (const a of Object.values(leerTodas())) {
    if (a.fecha !== fecha) continue;
    const item = a.items.find((i) => i.personalId === personalId && i.reemplazadoPor === null);
    if (item) return { naveId: a.naveId, nave: nombreNave(a.naveId), areaId: item.areaId, area: item.area, estado: item.estado };
  }
  const p = await buscarAsignacion(personalId);
  return p ? { ...p, estado: 'PLANTILLA' } : null;
}

// Saca a la persona de donde esté hoy (si era reemplazo de alguien, ese lugar queda libre)
function sacarDeHoy(fecha: string, personalId: number) {
  const todas = leerTodas();
  for (const a of Object.values(todas)) {
    if (a.fecha !== fecha) continue;
    const item = a.items.find((i) => i.personalId === personalId);
    if (!item) continue;
    a.items = a.items
      .filter((i) => i.personalId !== personalId)
      .map((i): ItemAsistencia => (item.esReemplazo && i.personalId === item.reemplazaA ? { ...i, reemplazadoPor: null } : i));
  }
  escribirTodas(todas);
}

function areaOrigenGuardada(fecha: string, origen: UbicacionHoy | null): string | null {
  if (!origen || origen.estado === 'PLANTILLA') return null;
  return leerDia(fecha, origen.naveId)?.areasGuardadas.includes(origen.areaId)
    ? `El área ${origen.area} de ${origen.nave} está guardada. Pulsa EDITAR en esa área primero.`
    : null;
}

// ¿Faltó hoy y ya tiene a otra persona ocupando su puesto?
function tieneReemplazoHoy(fecha: string, personalId: number): boolean {
  return Object.values(leerTodas()).some((a) =>
    a.fecha === fecha && a.items.some((i) => i.personalId === personalId && i.reemplazadoPor !== null));
}

// Mueve (o agrega) a una persona a otra área/nave HOY y actualiza la plantilla.
// Devuelve un mensaje de error, o null si todo salió bien.
export async function moverPersona(
  fecha: string, persona: PersonaBase, destinoNaveId: number, destinoAreaId: number, estado: EstadoAsistencia,
): Promise<string | null> {
  const origen = await ubicacionHoy(fecha, persona.personalId);
  if (tieneReemplazoHoy(fecha, persona.personalId)) {
    return `${nombreDe(persona)} ya tiene reemplazo. Primero quita su inasistencia.`;
  }
  if (origen && origen.naveId === destinoNaveId && origen.areaId === destinoAreaId) return `${nombreDe(persona)} ya está en esa área.`;
  const bloqueo = areaOrigenGuardada(fecha, origen);
  if (bloqueo) return bloqueo;

  const destino = await obtenerAsistenciaDia(fecha, destinoNaveId);
  if (destino.areasGuardadas.includes(destinoAreaId)) {
    return `El área ${nombreArea(destinoAreaId)} de ${nombreNave(destinoNaveId)} está guardada. Pulsa EDITAR primero.`;
  }
  if (activos(destino, destinoAreaId) >= cupo(destino, destinoAreaId)) {
    return `${nombreArea(destinoAreaId)} de ${nombreNave(destinoNaveId)} está completa (máximo ${cupo(destino, destinoAreaId)} según plantilla).`;
  }

  sacarDeHoy(fecha, persona.personalId);
  const r = leerDia(fecha, destinoNaveId) ?? destino;
  const estadoFinal = origen?.estado === 'AUSENTE' ? 'PENDIENTE' : estado;
  // un ausente llega sin marcar
  r.items.push(nuevoItem(persona, destinoAreaId, estadoFinal, { movidoDe: origen ? `${origen.nave} – ${origen.area}` : null }));
  escribirDia(r);

  await asignarEnPlantilla(destinoNaveId, itemPlantilla(persona, destinoAreaId));
  return null;
}

// Reemplaza a quien faltó: queda AUSENTE y el reemplazo entra PRESENTE. Actualiza la plantilla.
export async function reemplazar(
  fecha: string, naveId: number, original: ItemAsistencia, persona: PersonaBase, motivo: string, servis: boolean,
): Promise<string | null> {
  if (persona.personalId === original.personalId) return 'Elige a otra persona.';
    if (tieneReemplazoHoy(fecha, persona.personalId)) {
    return `${nombreDe(persona)} ya tiene reemplazo. Primero quita su inasistencia.`;
  }
  const origen = await ubicacionHoy(fecha, persona.personalId);
  if (origen?.estado === 'AUSENTE') return `${nombreDe(persona)} está marcado AUSENTE hoy.`;
  if (origen && origen.naveId === naveId && origen.areaId === original.areaId) return `${nombreDe(persona)} ya trabaja en ${original.area}.`;
  const bloqueo = areaOrigenGuardada(fecha, origen);
  if (bloqueo) return bloqueo;

  sacarDeHoy(fecha, persona.personalId);
  const r = leerDia(fecha, naveId) ?? (await obtenerAsistenciaDia(fecha, naveId));
  r.items = r.items.map((i): ItemAsistencia =>
    i.personalId === original.personalId ? { ...i, estado: 'AUSENTE', motivo, reemplazadoPor: persona.personalId } : i);
  r.items.push(nuevoItem(persona, original.areaId, 'PRESENTE', {
    servis,
    esReemplazo: true,
    reemplazaA: original.personalId,
    movidoDe: origen ? `${origen.nave} – ${origen.area}` : null,
  }));
  escribirDia(r);

  // Plantilla: el reemplazo ocupa desde ahora el puesto de quien faltó
  await quitarDeTodasLasPlantillas(original.personalId);
  await asignarEnPlantilla(naveId, itemPlantilla(persona, original.areaId));
  return null;
}

// Deshace un reemplazo: lo quita, la persona original vuelve sin marcar y a la plantilla
export async function deshacerReemplazo(fecha: string, naveId: number, item: ItemAsistencia): Promise<string | null> {
  if (!item.esReemplazo || item.reemplazaA === null) return null;
  if (item.reemplazadoPor !== null) return 'Primero quita el reemplazo de esta persona.';
  const r = leerDia(fecha, naveId);
  if (!r) return null;

  const original = r.items.find((i) => i.personalId === item.reemplazaA);
  r.items = r.items
    .filter((i) => i.personalId !== item.personalId)
    .map((i): ItemAsistencia =>
      i.personalId === item.reemplazaA ? { ...i, estado: 'PENDIENTE', motivo: null, reemplazadoPor: null } : i);
  escribirDia(r);

  await quitarDeTodasLasPlantillas(item.personalId);
  if (original) await asignarEnPlantilla(naveId, itemPlantilla(original, original.areaId));
  return null;
}

// Quita la inasistencia: la persona vuelve a estar sin marcar. Si tenía reemplazo, también lo deshace.
export async function quitarInasistencia(fecha: string, naveId: number, item: ItemAsistencia): Promise<string | null> {
  const r = await obtenerAsistenciaDia(fecha, naveId);
  const actual = r.items.find((i) => i.personalId === item.personalId);
  if (!actual || actual.estado !== 'AUSENTE') return null;

  // Tiene reemplazo: se deshace y la persona original vuelve a la asistencia y a la plantilla
  if (actual.reemplazadoPor !== null) {
    const reemplazo = r.items.find((i) => i.personalId === actual.reemplazadoPor);
    if (reemplazo) return deshacerReemplazo(fecha, naveId, reemplazo);
  }

  // Si ya no está en la plantilla, al quedar sin marcar saldría de la lista
  const plantilla = await obtenerPlantilla(naveId);
  if (!plantilla.items.some((i) => i.personalId === actual.personalId)) {
    return `${nombreDe(actual)} ya no está en la plantilla. Si debe seguir, agrégalo primero en PLANTILLA.`;
  }

  if (activos(r, actual.areaId) >= cupo(r, actual.areaId)) {
    return `${actual.area} ya está completa (${cupo(r, actual.areaId)}). Muévelo a otra área o libera un lugar.`;
  }

  r.items = r.items.map((i): ItemAsistencia =>
    i.personalId === actual.personalId ? { ...i, estado: 'PENDIENTE', motivo: null, reemplazadoPor: null } : i);
  escribirDia(r);
  return null;
}