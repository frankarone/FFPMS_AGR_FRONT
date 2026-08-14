export interface Usuario {
  userName: string;
  nombre: string;
  roles: string[];
}

export interface LoginResponse {
  ok: boolean;
  token?: string;
  usuario?: Usuario;
  mensaje?: string;
}