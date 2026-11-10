import { useEffect, useState } from 'react';
import { obtenerDashboard } from '../services/asistenciaService';
import { listarNavesProceso } from '../services/catalogoProcesoService';
import type { DashboardAsistencia, NaveProceso } from '../types/asistencia';
import { fechaISO } from '../utils/fecha';

const REFRESCO_MS = 30_000; // actualización automática cada 30 segundos

export function useDashboardAsistencia() {
  const [fecha, setFecha] = useState(fechaISO()); // siempre HOY (luego se podrá elegir otra)
  const [naveId, setNaveId] = useState<number | null>(null); // null = todas las naves
  const [naves, setNaves] = useState<NaveProceso[]>([]);
  const [datos, setDatos] = useState<DashboardAsistencia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizado, setActualizado] = useState<Date | null>(null);

  useEffect(() => {
    listarNavesProceso().then(setNaves);
  }, []);

  // Carga al entrar o al cambiar fecha/nave, y luego se refresca sola cada 30 s (sin parpadear)
  useEffect(() => {
    let activo = true;
    const cargar = (primeraVez: boolean) => {
      if (primeraVez) { setCargando(true); setError(''); }
      obtenerDashboard(fecha, naveId)
        .then((d) => {
          if (!activo) return;
          if (d) { setDatos(d); setActualizado(new Date()); setError(''); }
          else if (primeraVez) setError('No se pudo cargar la asistencia');
        })
        .catch(() => { if (activo && primeraVez) setError('No se pudo cargar la asistencia'); })
        .finally(() => { if (activo && primeraVez) setCargando(false); });
    };
    cargar(true);
    const timer = window.setInterval(() => cargar(false), REFRESCO_MS);
    return () => { activo = false; window.clearInterval(timer); };
  }, [fecha, naveId]);

  const naveNombre = naves.find((n) => n.id === naveId)?.nombre ?? 'TODAS LAS NAVES';

  return { fecha, setFecha, naveId, setNaveId, naves, naveNombre, datos, cargando, error, actualizado };
}