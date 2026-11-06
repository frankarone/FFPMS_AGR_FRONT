import type { PlantillaNave, PersonaAsistencia, AreaProceso, Asignacion, ItemPlantilla } from '../types/asistencia';
import { PERSONAL_MOCK, AREAS_MOCK, NAVES_MOCK } from './mock/asistenciaMock';

// MODO LOCAL: las plantillas se guardan en el navegador (localStorage).
// Al conectar el backend se reemplaza por:
//   GET/PUT /api/plantillas/{naveId}, GET /api/personal/dni/{dni}, GET /api/areas-proceso
const CLAVE = 'ffpms.asistencia.plantillas';

function leerTodas(): Record<number, PlantillaNave> {
  try {
    return JSON.parse(localStorage.getItem(CLAVE) || '{}');
  } catch {
    return {};
  }
}

function escribirTodas(todas: Record<number, PlantillaNave>) {
  localStorage.setItem(CLAVE, JSON.stringify(todas));
}

function vacia(naveId: number): PlantillaNave {
  return { naveId, items: [], areasGuardadas: [], actualizado: '' };
}

export async function listarAreasProceso(): Promise<AreaProceso[]> {
  return AREAS_MOCK.filter((a) => a.activo);
}

export async function buscarPersonalPorDni(dni: string): Promise<PersonaAsistencia | null> {
  return PERSONAL_MOCK.find((p) => p.dni === dni.trim()) ?? null;
}

export async function obtenerPlantilla(naveId: number): Promise<PlantillaNave> {
  return leerTodas()[naveId] ?? vacia(naveId);
}

export async function guardarPlantilla(plantilla: PlantillaNave): Promise<void> {
  const todas = leerTodas();
  todas[plantilla.naveId] = { ...plantilla, actualizado: new Date().toISOString() };
  escribirTodas(todas);
}

// ¿En qué nave y área está asignada esta persona? (null = en ninguna)
export async function buscarAsignacion(personalId: number): Promise<Asignacion | null> {
  for (const p of Object.values(leerTodas())) {
    const item = p.items.find((i) => i.personalId === personalId);
    if (item) {
      const nave = NAVES_MOCK.find((n) => n.id === p.naveId)?.nombre ?? `NAVE ${p.naveId}`;
      return { naveId: p.naveId, nave, areaId: item.areaId, area: item.area };
    }
  }
  return null;
}

export async function quitarDePlantilla(naveId: number, personalId: number): Promise<void> {
  const p = await obtenerPlantilla(naveId);
  await guardarPlantilla({ ...p, items: p.items.filter((i) => i.personalId !== personalId) });
}


// Pone a la persona en esa nave/área y la quita de cualquier otra plantilla
export async function asignarEnPlantilla(naveId: number, item: ItemPlantilla): Promise<void> {
  const todas = leerTodas();
  for (const p of Object.values(todas)) {
    p.items = p.items.filter((i) => i.personalId !== item.personalId);
  }
  const destino = todas[naveId] ?? vacia(naveId);
  destino.items = [...destino.items, item];
  destino.actualizado = new Date().toISOString();
  todas[naveId] = destino;
  escribirTodas(todas);
}

// Quita a la persona de todas las plantillas
export async function quitarDeTodasLasPlantillas(personalId: number): Promise<void> {
  const todas = leerTodas();
  for (const p of Object.values(todas)) {
    p.items = p.items.filter((i) => i.personalId !== personalId);
  }
  escribirTodas(todas);
}