import { useEffect, useState } from 'react';
import { listarOrdenes, descargarOrdenPdf } from '../services/ordenService';
import type { Orden } from '../types/orden';

export function useReporteOrden() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(true);
  const [descargando, setDescargando] = useState('');

  const buscar = () => {
    setCargando(true);
    listarOrdenes(desde, hasta)
      .then((datos) => { if (Array.isArray(datos)) setOrdenes(datos); })
      .finally(() => setCargando(false));
  };

  useEffect(() => { buscar(); }, []);

  const descargar = async (numero: string) => {
    setDescargando(numero);
    await descargarOrdenPdf(numero);
    setDescargando('');
  };

  const filtradas = ordenes.filter((o) => {
    const t = busqueda.toLowerCase();
    return o.numero.toLowerCase().includes(t) || (o.proveedor || '').toLowerCase().includes(t);
  });

  return {
    filtradas, cargando, descargando,
    busqueda, setBusqueda,
    desde, setDesde,
    hasta, setHasta,
    buscar, descargar,
  };
}