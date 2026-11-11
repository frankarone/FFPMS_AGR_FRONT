export interface NaveProceso {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface AreaProceso {
  id: number;
  nombre: string;
  activo: boolean;
}

// Lo único que se toma de Registro Personal (+ si está activo o cesado)
export interface PersonaAsistencia {
  personalId: number;
  dni: string;
  nombres: string;
  apellidos: string;
  activo: boolean;
}

// Una fila de la plantilla del día: persona + nave + área + si vino o no
export interface RegistroAsistencia extends PersonaAsistencia {
  id: number;
  fecha: string; // yyyy-MM-dd
  naveId: number;
  nave: string;
  areaId: number;
  area: string;
  presente: boolean;
}

export interface ResumenDia {
  fecha: string;
  total: number;
  presentes: number;
  ausentes: number;
  porcentaje: number;
  pendientes: number; // sin marcar
}

export interface AsistenciaPorGrupo {
  id: number;
  nombre: string;
  presentes: number;
  ausentes: number;
  porcentaje: number;
  pendientes: number; // sin marcar
}

export interface AsistenciaDia {
  fecha: string;
  presentes: number;
  ausentes: number;
  porcentaje: number;
  pendientes: number; // sin marcar
}

export interface DashboardAsistencia {
  resumen: ResumenDia;
  porNave: AsistenciaPorGrupo[];
  porArea: AsistenciaPorGrupo[];
  ultimos7Dias: AsistenciaDia[];
}


// Persona asignada a un área dentro de la plantilla de una nave
export interface ItemPlantilla {
  personalId: number;
  dni: string;
  nombres: string;
  apellidos: string;
  areaId: number;
  area: string;
}

// Plantilla permanente de una nave (se conserva día a día)
export interface PlantillaNave {
  naveId: number;
  items: ItemPlantilla[];
  areasGuardadas: number[]; // áreas confirmadas con GUARDAR (bloqueadas)
  estimados: Record<number, number>; // areaId → TOTAL ESTIMADO
}

// Dónde está asignada una persona
export interface Asignacion {
  naveId: number;
  nave: string;
  areaId: number;
  area: string;
}


export type EstadoAsistencia = 'PENDIENTE' | 'PRESENTE' | 'AUSENTE';

// Una persona en la asistencia del día (sale de la plantilla o es un reemplazo)
export interface ItemAsistencia extends ItemPlantilla {
  estado: EstadoAsistencia;
  motivo: string | null;          // motivo de inasistencia
  servis: boolean;                // marcado en CAMBIAR PERSONAL: el reemplazo pertenece a SERVIS
  esReemplazo: boolean;           // entró hoy reemplazando a otro
  reemplazaA: number | null;      // personalId de quien faltó
  reemplazadoPor: number | null;  // personalId de quien lo reemplazó
  movidoDe: string | null;        // "NAVE 1 – SELECCIÓN" si hoy vino de otra área/nave
}

// Asistencia de una nave en un día
export interface AsistenciaNaveDia {
  fecha: string;
  naveId: number;
  items: ItemAsistencia[];
  areasGuardadas: number[];
  cupos: Record<number, number>;  // máximo de personas activas por área (según plantilla)
}

// Datos básicos de una persona
export type PersonaBase = Pick<PersonaAsistencia, 'personalId' | 'dni' | 'nombres' | 'apellidos'>;

// Dónde está una persona hoy ('PLANTILLA' = solo asignada, la asistencia de esa nave aún no se abrió)
export interface UbicacionHoy extends Asignacion {
  estado: EstadoAsistencia | 'PLANTILLA';
}


// ---- VER ASISTENCIA (reporte por nave y día) ----
export interface ReportePersona {
  dni: string;
  nombre: string;
  area: string;
  estado: EstadoAsistencia;
  observacion: string;
}

export interface ReporteArea {
  areaId: number;
  area: string;
  totalEstimado: number | null;
  asistieron: number;
  ausentes: number;
  pendientes: number;
  personas: ReportePersona[];
}

export interface ReporteAsistencia {
  fecha: string;
  naveId: number;
  nave: string;
  totalEstimado: number;
  asistieron: number;
  ausentes: number;
  pendientes: number;
  areas: ReporteArea[];
}