import { useEffect, useState } from 'react';
import { obtenerReporte, descargarReporteExcel } from '../services/asistenciaService';
import { listarNavesProceso } from '../services/catalogoProcesoService';
import type { NaveProceso, ReporteAsistencia } from '../types/asistencia';
import { fechaISO } from '../utils/fecha';

export function useReporteAsistencia() {
  const [fecha, setFecha] = useState(fechaISO());
  const [naveId, setNaveId] = useState<number | null>(null);
  const [naves, setNaves] = useState<NaveProceso[]>([]);
  const [reporte, setReporte] = useState<ReporteAsistencia | null>(null);
  const [cargando, setCargando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listarNavesProceso().then(setNaves);
  }, []);

  // Al elegir fecha y nave, el reporte se carga solo
  useEffect(() => {
    setReporte(null);
    setError('');
    if (naveId === null || !fecha) return;
    let activo = true;
    setCargando(true);
    obtenerReporte(fecha, naveId)
      .then((r) => {
        if (!activo) return;
        if (r) setReporte(r);
        else setError('No se pudo cargar el reporte');
      })
      .catch(() => { if (activo) setError('No se pudo cargar el reporte'); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [fecha, naveId]);

  const descargar = async () => {
    if (naveId === null) return;
    setDescargando(true);
    const ok = await descargarReporteExcel(fecha, naveId);
    setDescargando(false);
    if (!ok) setError('No se pudo descargar el Excel');
  };

  return { fecha, setFecha, naveId, setNaveId, naves, reporte, cargando, descargando, error, descargar, hoy: fechaISO() };
}