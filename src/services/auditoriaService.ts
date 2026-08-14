import { apiGet } from './repository/apiClient';
import type { Registro } from '../types/auditoria';

export function listarAuditoria() {
  return apiGet<Registro[]>('/api/auditoria');
}