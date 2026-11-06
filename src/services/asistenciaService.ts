import type { DashboardAsistencia, AsistenciaPorGrupo, RegistroAsistencia, NaveProceso } from '../types/asistencia';
import { ASISTENCIA_MOCK, NAVES_MOCK } from './mock/asistenciaMock';
import { fechaISO } from '../utils/fecha';

// MODO LOCAL. Al conectar el backend será:
//   return apiGet<NaveProceso[]>('/api/naves-proceso');
export async function listarNavesProceso(): Promise<NaveProceso[]> {
  return NAVES_MOCK.filter((n) => n.activo);
}

// MODO LOCAL: calcula el dashboard con los datos de prueba.
// naveId = null → todas las naves. Al conectar el backend será:
//   return apiGet<DashboardAsistencia>(`/api/asistencia/dashboard?fecha=${fecha}${naveId ? `&naveId=${naveId}` : ''}`);
export async function obtenerDashboard(fecha: string, naveId: number | null): Promise<DashboardAsistencia> {
  const base = naveId ? ASISTENCIA_MOCK.filter((r) => r.naveId === naveId) : ASISTENCIA_MOCK;

  const delDia = base.filter((r) => r.fecha === fecha);
  const presentes = delDia.filter((r) => r.presente).length;

  const ultimos7Dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(`${fecha}T00:00:00`);
    d.setDate(d.getDate() - (6 - i));
    const f = fechaISO(d);
    const regs = base.filter((r) => r.fecha === f);
    const p = regs.filter((r) => r.presente).length;
    return { fecha: f, presentes: p, ausentes: regs.length - p, porcentaje: porcentaje(p, regs.length) };
  });

  return {
    resumen: {
      fecha,
      total: delDia.length,
      presentes,
      ausentes: delDia.length - presentes,
      porcentaje: porcentaje(presentes, delDia.length),
    },
    porNave: agrupar(delDia, (r) => r.naveId, (r) => r.nave),
    porArea: agrupar(delDia, (r) => r.areaId, (r) => r.area),
    ultimos7Dias,
  };
}

function porcentaje(parte: number, total: number): number {
  return total ? Math.round((parte / total) * 100) : 0;
}

function agrupar(
  regs: RegistroAsistencia[],
  id: (r: RegistroAsistencia) => number,
  nombre: (r: RegistroAsistencia) => string,
): AsistenciaPorGrupo[] {
  const mapa = new Map<number, AsistenciaPorGrupo>();
  regs.forEach((r) => {
    const g = mapa.get(id(r)) ?? { id: id(r), nombre: nombre(r), presentes: 0, ausentes: 0, porcentaje: 0 };
    if (r.presente) g.presentes++;
    else g.ausentes++;
    mapa.set(g.id, g);
  });
  return [...mapa.values()]
    .map((g) => ({ ...g, porcentaje: porcentaje(g.presentes, g.presentes + g.ausentes) }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}