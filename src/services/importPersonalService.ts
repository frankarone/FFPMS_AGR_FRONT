import { apiDownload, apiUpload } from './repository/apiClient';
import type { ResultadoImport } from '../types/personal';

export function descargarPlantilla() {
  return apiDownload('/api/personal/plantilla', 'plantilla-personal.xlsx');
}
export function importarPersonal(archivo: File) {
  const fd = new FormData();
  fd.append('archivo', archivo);
  return apiUpload<ResultadoImport>('/api/personal/importar', fd);
}