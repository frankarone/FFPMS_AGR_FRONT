export interface Maestro {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface PersonalInput {
  dni: string;
  nombres: string;
  apellidos: string;
  sexo: string;
  estadoCivil: string;
  hijos: boolean;
  cv: boolean;
  copiaDni: boolean;
  recibo: boolean;
  antecedentePolicial: boolean;
  cargoId: number | null;
  areaId: number | null;
  tipoPersonalId: number | null;
  nacionalidadId: number | null;
  gradoInstruccionId: number | null;
  correoElectronico: string;
  domicilio: string;
  observacion: string;
  fechaNacimiento: string;
  fechaIngreso: string;
  fechaCese: string;
  celular: string;
  activo: boolean;
  sueldo: number | null;
  tieneSeguro: boolean;
  sistemaPension: string;
  bancoId: number | null;
  nroCuenta: string;
  asignacionFamiliar: string;
}

export interface PersonalListado {
  id: number;
  dni: string;
  nombres: string;
  apellidos: string;
  sexo: string;
  estadoCivil: string;
  hijos: boolean;
  asignacionFamiliar: string;
  cv: boolean;
  copiaDni: boolean;
  recibo: boolean;
  antecedentePolicial: boolean;
  correoElectronico: string | null;
  domicilio: string | null;
  observacion: string | null;
  cargo: string;
  area: string;
  tipoPersonal: string | null;
  nacionalidad: string | null;
  gradoInstruccion: string | null;
  cargoId: number;
  areaId: number;
  tipoPersonalId: number | null;
  nacionalidadId: number | null;
  gradoInstruccionId: number | null;
  fechaNacimiento: string | null;
  fechaIngreso: string | null;
  fechaCese: string | null;
  fechaRegistro: string;
  celular: string | null;
  activo: boolean;
  sueldo: number | null;
  tieneSeguro: boolean;
  sistemaPension: string | null;
  identMenor: boolean;
  bancoId: number | null;
  banco: string | null;
  nroCuenta: string | null;
}

export interface RespuestaCrear {
  ok: boolean;
  mensaje: string;
}

export interface PersonalPeriodo {
  id: number;
  personalId: number;
  fechaIngreso: string;
  fechaCese: string | null;
  motivoCese: string | null;
  fechaRegistro: string;
}

export interface PersonalDocumento {
  id: number;
  personalId: number;
  tipo: string;
  nombreOriginal: string;
  nombreGuardado: string;
  contentType: string | null;
  fechaSubida: string;
}

export interface ReportePersonalFila {
  dni: string;
  nombres: string;
  apellidos: string;
  sexo: string;
  estadoCivil: string;
  cargo: string;
  area: string;
  tipoPersonal: string | null;
  nacionalidad: string | null;
  gradoInstruccion: string | null;
  correoElectronico: string | null;
  celular: string | null;
  domicilio: string | null;
  sueldo: number | null;
  tieneSeguro: boolean;
  sistemaPension: string | null;
  hijos: boolean;
  asignacionFamiliar: string;
  activo: boolean;
  fechaNacimiento: string | null;
  fechaIngreso: string | null;
  fechaCese: string | null;
  fechaRegistro: string;
}

export interface ResultadoImport {
  ok: boolean;
  insertados: number;
  errores: { fila: number; motivo: string }[];
}