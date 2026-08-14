import { apiGet } from './repository/apiClient';
import type { PalletQR } from '../types/pallet';

export function buscarPallet(nroPallet: string) {
  return apiGet<PalletQR>(`/api/pallet/${nroPallet}`);
}