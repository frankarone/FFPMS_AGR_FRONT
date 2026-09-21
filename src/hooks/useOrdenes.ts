import { useEffect, useState } from 'react';
import { listarOrdenes, detalleOrden } from '../services/ordenService';
import type { Orden, DetalleOrden } from '../types/orden';

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const buscar = () => {
    setCargando(true);
    listarOrdenes(desde, hasta)
      .then((datos) => { if (Array.isArray(datos)) setOrdenes(datos); })
      .finally(() => setCargando(false));
  };

  useEffect(() => { buscar(); }, []);

  const verDetalle = async (numero: string) => {
    const d = await detalleOrden(numero);
    setDetalle(d);
  };

  const cerrarDetalle = () => setDetalle(null);

  const filtradas = ordenes.filter((o) => {
    const okFiltro =
      filtro === 'TODOS' ||
      (filtro === 'CON' && o.estadoFactura === 'CON FACTURA') ||
      (filtro === 'SIN' && o.estadoFactura === 'SIN FACTURA');
    const texto = busqueda.toLowerCase();
    const okBusqueda =
      o.numero.toLowerCase().includes(texto) ||
      (o.proveedor || '').toLowerCase().includes(texto);
    return okFiltro && okBusqueda;
  });

  return {
    filtradas, detalle, cargando,
    busqueda, setBusqueda,
    filtro, setFiltro,
    desde, setDesde,
    hasta, setHasta,
    buscar, verDetalle, cerrarDetalle,
  };
}