import { useEffect, useState } from 'react';
import { listarAreas, listarTiposPersonal } from '../services/maestroService';
import { listarReportePersonal, descargarReportePersonalExcel } from '../services/reportePersonalService';
import type { Maestro, ReportePersonalFila } from '../types/personal';

export function useReportePersonal() {
  const [areas, setAreas] = useState<Maestro[]>([]);
  const [tipos, setTipos] = useState<Maestro[]>([]);
  const [datos, setDatos] = useState<ReportePersonalFila[]>([]);
  const [cargando, setCargando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [descargando, setDescargando] = useState(false);

  const [campoFecha, setCampoFecha] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [areaId, setAreaId] = useState<number | null>(null);
  const [tipoPersonalId, setTipoPersonalId] = useState<number | null>(null);
  const [estado, setEstado] = useState('');

  useEffect(() => {
    listarAreas().then((d) => { if (Array.isArray(d)) setAreas(d); });
    listarTiposPersonal().then((d) => { if (Array.isArray(d)) setTipos(d); });
  }, []);

  const filtros = () => ({ campoFecha, desde, hasta, areaId, tipoPersonalId, estado });

  const buscar = () => {
    setCargando(true);
    setBuscado(true);
    listarReportePersonal(filtros())
      .then((d) => { if (Array.isArray(d)) setDatos(d); })
      .finally(() => setCargando(false));
  };

  const exportar = async () => {
    setDescargando(true);
    await descargarReportePersonalExcel(filtros());
    setDescargando(false);
  };

  const limpiar = () => {
    setCampoFecha(''); setDesde(''); setHasta('');
    setAreaId(null); setTipoPersonalId(null); setEstado('');
  };

  return {
    areas, tipos, datos, cargando, buscado, descargando,
    campoFecha, setCampoFecha, desde, setDesde, hasta, setHasta,
    areaId, setAreaId, tipoPersonalId, setTipoPersonalId, estado, setEstado,
    buscar, exportar, limpiar,
  };
}