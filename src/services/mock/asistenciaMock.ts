// DATOS DE PRUEBA (modo local). Se eliminan cuando conectemos el backend.
import type { NaveProceso, AreaProceso, PersonaAsistencia, RegistroAsistencia } from '../../types/asistencia';
import { fechaISO } from '../../utils/fecha';

export const NAVES_MOCK: NaveProceso[] = [
  { id: 1, nombre: 'NAVE 1', activo: true },
  { id: 2, nombre: 'NAVE 2', activo: true },
  { id: 3, nombre: 'NAVE 3', activo: true },
  { id: 4, nombre: 'NAVE 4', activo: true },
];

export const AREAS_MOCK: AreaProceso[] = [
  { id: 1, nombre: 'RECEPCIÓN', activo: true },
  { id: 2, nombre: 'SELECCIÓN', activo: true },
  { id: 3, nombre: 'CALIBRADO', activo: true },
  { id: 4, nombre: 'EMPAQUE', activo: true },
  { id: 5, nombre: 'PALETIZADO', activo: true },
];

const NOMBRES = ['JUAN', 'MARIA', 'CARLOS', 'ROSA', 'LUIS', 'ANA', 'JOSE', 'CARMEN', 'PEDRO', 'LUCIA'];
const APELLIDOS = ['QUISPE', 'FLORES', 'RAMOS', 'TORRES', 'MENDOZA', 'CASTILLO', 'VARGAS', 'ROJAS', 'HUAMAN', 'CHAVEZ'];

// 30 personas ficticias (luego vendrán de Registro Personal)
export const PERSONAL_MOCK: PersonaAsistencia[] = Array.from({ length: 30 }, (_, i) => ({
  personalId: i + 1,
  dni: String(70000000 + i * 137),
  nombres: NOMBRES[i % NOMBRES.length],
  apellidos: `${APELLIDOS[(i * 3) % APELLIDOS.length]} ${APELLIDOS[(i * 7 + 1) % APELLIDOS.length]}`,
  activo: i % 11 !== 5, // algunos cesados para probar el mensaje
}));

// Aleatorio con semilla: los datos salen iguales cada vez que recargas
function aleatorio(semilla: number) {
  let s = semilla;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generarDia(fecha: string, semilla: number): RegistroAsistencia[] {
  const rnd = aleatorio(semilla);
  const registros: RegistroAsistencia[] = [];
  PERSONAL_MOCK.forEach((p) => {
    if (rnd() < 0.15) return; // ese día no estaba en la plantilla
    const nave = NAVES_MOCK[Math.floor(rnd() * NAVES_MOCK.length)];
    const area = AREAS_MOCK[Math.floor(rnd() * AREAS_MOCK.length)];
    registros.push({
      ...p,
      id: semilla * 1000 + p.personalId,
      fecha,
      naveId: nave.id, nave: nave.nombre,
      areaId: area.id, area: area.nombre,
      presente: rnd() < 0.85,
    });
  });
  return registros;
}

// Asistencia de prueba de los últimos 15 días (hoy incluido)
export const ASISTENCIA_MOCK: RegistroAsistencia[] = Array.from({ length: 15 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - i);
  return generarDia(fechaISO(d), i + 1);
}).flat();