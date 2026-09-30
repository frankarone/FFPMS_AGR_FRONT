// Formatea a dd/mm/aaaa. Acepta 'yyyy-MM-dd', ISO datetime, o null.
export function formatearFecha(valor: string | null | undefined): string {
  if (!valor) return '-';

  // Caso 'yyyy-MM-dd' (fechas puras) → reordenar sin new Date (evita desfase por zona horaria)
  if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    const [a, m, d] = valor.split('-');
    return `${d}/${m}/${a}`;
  }

  // Caso datetime/ISO (ej. FechaRegistro) → partes locales
  const dt = new Date(valor);
  if (isNaN(dt.getTime())) return valor;
  const dd = String(dt.getDate()).padStart(2, '0');
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${dt.getFullYear()}`;
}