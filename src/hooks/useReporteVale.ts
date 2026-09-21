import { useState } from 'react';
import { listarVales, descargarValePdf } from '../services/valeService';
import type { Vale } from '../types/vale';

export function useReporteVale() {
  const [vales, setVales] = useState<Vale[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [descargando, setDescargando] = useState('');

  const buscar = () => {
    setCargando(true);
    listarVales(desde, hasta)
      .then((datos) => { if (Array.isArray(datos)) setVales(datos); })
      .finally(() => setCargando(false));
  };

  const descargar = async (numero: string) => {
    setDescargando(numero);
    await descargarValePdf(numero);
    setDescargando('');
  };

  const filtradas = vales.filter((v) => {
    const t = busqueda.toLowerCase();
    return (v.numero || '').toLowerCase().includes(t) || (v.solicitadoPor || '').toLowerCase().includes(t);
  });

  return {
    filtradas, cargando, descargando,
    busqueda, setBusqueda,
    desde, setDesde,
    hasta, setHasta,
    buscar, descargar,
  };
}