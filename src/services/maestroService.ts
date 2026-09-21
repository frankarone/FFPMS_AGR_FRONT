import { apiGet, apiPost, apiPut, apiDelete } from './repository/apiClient';
import type { Maestro } from '../types/personal';

export function listarCargos()             { return apiGet<Maestro[]>('/api/cargos'); }
export function listarAreas()              { return apiGet<Maestro[]>('/api/areas'); }
export function listarTiposPersonal()      { return apiGet<Maestro[]>('/api/tipos-personal'); }
export function listarNacionalidades()     { return apiGet<Maestro[]>('/api/nacionalidades'); }
export function listarGradosInstruccion()  { return apiGet<Maestro[]>('/api/grados-instruccion'); }

type Resp = { ok: boolean; mensaje: string };

export function listarMaestro(base: string) {
  return apiGet<Maestro[]>(base);
}
export function crearMaestro(base: string, nombre: string) {
  return apiPost<Resp>(base, { nombre });
}
export function actualizarMaestro(base: string, id: number, nombre: string) {
  return apiPut<Resp>(`${base}/${id}`, { nombre });
}
export function eliminarMaestro(base: string, id: number) {
  return apiDelete<Resp>(`${base}/${id}`);
}
export function listarBancos() { return apiGet<Maestro[]>('/api/bancos'); }