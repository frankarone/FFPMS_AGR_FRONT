
import { apiGet, apiPost, apiPut, apiDelete, apiUpload, apiVerArchivo } from './repository/apiClient';
import type { PersonalInput, PersonalListado, PersonalPeriodo, PersonalDocumento, RespuestaCrear } from '../types/personal';

export function listarPersonal() {
  return apiGet<PersonalListado[]>('/api/personal');
}
export function crearPersonal(personal: PersonalInput) {
  return apiPost<RespuestaCrear>('/api/personal', personal);
}
export function actualizarPersonal(id: number, personal: PersonalInput) {
  return apiPut<RespuestaCrear>(`/api/personal/${id}`, personal);
}
export function eliminarPersonal(id: number) {
  return apiDelete<RespuestaCrear>(`/api/personal/${id}`);
}
export function cesarPersonal(id: number, data: { fechaCese: string; motivoCese: string }) {
  return apiPost<RespuestaCrear>(`/api/personal/${id}/cesar`, data);
}
export function reingresarPersonal(id: number, data: { fechaIngreso: string }) {
  return apiPost<RespuestaCrear>(`/api/personal/${id}/reingresar`, data);
}
export function historialPersonal(id: number) {
  return apiGet<PersonalPeriodo[]>(`/api/personal/${id}/historial`);
}
export function listarDocumentos(id: number) {
  return apiGet<PersonalDocumento[]>(`/api/personal/${id}/documentos`);
}
export function subirDocumento(id: number, tipo: string, archivo: File) {
  const fd = new FormData();
  fd.append('tipo', tipo);
  fd.append('archivo', archivo);
  return apiUpload<RespuestaCrear>(`/api/personal/${id}/documentos`, fd);
}
export function verDocumento(docId: number) {
  return apiVerArchivo(`/api/personal/documentos/${docId}`);
}
export function eliminarDocumento(docId: number) {
  return apiDelete<RespuestaCrear>(`/api/personal/documentos/${docId}`);
}