// Cliente HTTP base: token, manejo de 401 y descargas. Lo reusan todos los services.

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function manejar401() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.reload(); // vuelve al login
}

// GET que devuelve JSON (o null si la sesión expiró)
export async function apiGet<T>(url: string): Promise<T | null> {
  const r = await fetch(url, { headers: authHeaders() });
  if (r.status === 401) { manejar401(); return null; }
  return await r.json();
}

// POST con cuerpo JSON (para login, etc.)
export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  return await r.json();
}

// Descarga un archivo (PDF/Excel) y lo baja al navegador
export async function apiDownload(url: string, nombreArchivo: string): Promise<boolean> {
  const r = await fetch(url, { headers: authHeaders() });
  if (!r.ok) return false;
  const blob = await r.blob();
  const u = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = u;
  a.download = nombreArchivo;
  a.click();
  window.URL.revokeObjectURL(u);
  return true;
}

// PUT con cuerpo JSON (editar)
export async function apiPut<T>(url: string, body: unknown): Promise<T | null> {
  const r = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (r.status === 401) { manejar401(); return null; }
  return await r.json();
}

// DELETE (eliminar)
export async function apiDelete<T>(url: string): Promise<T | null> {
  const r = await fetch(url, { method: 'DELETE', headers: authHeaders() });
  if (r.status === 401) { manejar401(); return null; }
  return await r.json();
}

// Arma el desde&hasta (lo usan varios módulos)
export function queryFechas(desde?: string, hasta?: string): string {
  const params = new URLSearchParams();
  if (desde) params.append('desde', desde);
  if (hasta) params.append('hasta', hasta);
  const s = params.toString();
  return s ? `?${s}` : '';
}

// POST multipart (subir archivo).
export async function apiUpload<T>(url: string, formData: FormData): Promise<T | null> {
  const r = await fetch(url, { method: 'POST', headers: authHeaders(), body: formData });
  if (r.status === 401) { manejar401(); return null; }
  return await r.json();
}

// GET que abre el archivo en una pestaña nueva (con token)
export async function apiVerArchivo(url: string): Promise<boolean> {
  const r = await fetch(url, { headers: authHeaders() });
  if (r.status === 401) { manejar401(); return false; }
  if (!r.ok) return false;
  const blob = await r.blob();
  const u = window.URL.createObjectURL(blob);
  window.open(u, '_blank');
  setTimeout(() => window.URL.revokeObjectURL(u), 60000);
  return true;
}