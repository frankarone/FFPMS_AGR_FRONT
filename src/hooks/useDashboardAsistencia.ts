import { useEffect, useState } from 'react';
import { obtenerDashboard, listarNavesProceso } from '../services/asistenciaService';
import type { DashboardAsistencia, NaveProceso } from '../types/asistencia';
import { fechaISO } from '../utils/fecha';

export function useDashboardAsistencia() {
  const [fecha, setFecha] = useState(fechaISO()); // siempre HOY (luego se podrá elegir otra)
  const [naveId, setNaveId] = useState<number | null>(null); // null = todas las naves
  const [naves, setNaves] = useState<NaveProceso[]>([]);
  const [datos, setDatos] = useState<DashboardAsistencia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listarNavesProceso().then(setNaves);
  }, []);

  useEffect(() => {
    setCargando(true);
    setError('');
    obtenerDashboard(fecha, naveId)
      .then(setDatos)
      .catch(() => setError('No se pudo cargar la asistencia'))
      .finally(() => setCargando(false));
  }, [fecha, naveId]);

  const naveNombre = naves.find((n) => n.id === naveId)?.nombre ?? 'TODAS LAS NAVES';

  return { fecha, setFecha, naveId, setNaveId, naves, naveNombre, datos, cargando, error };
}