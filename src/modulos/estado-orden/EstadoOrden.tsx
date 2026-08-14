import { useEffect, useState } from 'react';
import { listarOrdenes, detalleOrden } from '../../services/ordenService';
import type { Orden, DetalleOrden } from '../../types/orden';
import './EstadoOrden.css';

function EstadoOrden() {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [filtro, setFiltro] = useState('TODOS'); 
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [cargando, setCargando] = useState(true);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  useEffect(() => { buscar(); }, []);

  const buscar = () => {
    setCargando(true);
    listarOrdenes(desde, hasta)
      .then((datos) => { if (Array.isArray(datos)) setOrdenes(datos); })
      .finally(() => setCargando(false));
  };

  const verDetalle = async (numero: string) => {
    const d = await detalleOrden(numero);
    setDetalle(d);
  };

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

  // ---- Vista DETALLE ----
  if (detalle && detalle.orden) {
    const o = detalle.orden;
    return (
      <div className="orden-contenedor">
        <button className="btn-volver" onClick={() => setDetalle(null)}>Regresar</button>
        <h2>Orden {o.numero}</h2>
        <div className="orden-cabecera">
          <p><b>Proveedor:</b> {o.proveedor} ({o.ruc})</p>
          <p><b>Fecha:</b> {new Date(o.fechaEmitido).toLocaleDateString()}</p>
          <p><b>Moneda:</b> {o.moneda}</p>
          <p><b>Factura:</b> {detalle.tieneFactura ? 'Con factura' : 'Sin factura'}</p>
          <p><b>Total Neto:</b> {detalle.neto?.toFixed(2)}</p>
          <p><b>IGV:</b> {detalle.igv?.toFixed(2)}</p>
          <p><b>TOTAL:</b> {detalle.total?.toFixed(2)}</p>
        </div>

        <h3>Ítems</h3>
        <table className="tabla">
          <thead><tr><th>Producto</th><th>Unidad</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr></thead>
          <tbody>
            {detalle.items.map((it, i) => (
              <tr key={i}>
                <td>{it.producto}</td><td>{it.unidad}</td><td>{it.cantidad}</td>
                <td>{it.precio}</td><td>{it.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Facturas</h3>
        {detalle.facturas.length === 0 ? (
          <p>Sin facturas registradas.</p>
        ) : (
          <table className="tabla">
            <thead><tr><th>N° Factura</th><th>Fecha</th><th>N° Guía</th></tr></thead>
            <tbody>
              {detalle.facturas.map((f, i) => (
                <tr key={i}>
                  <td>{f.nroFactura}</td>
                  <td>{f.fechaFactura ? new Date(f.fechaFactura).toLocaleDateString() : ''}</td>
                  <td>{f.nroGuia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  // ---- Vista LISTA ----
  return (
    <div className="orden-contenedor">
      <h1 className="orden-titulo">ESTADO DE ÓRDENES</h1>

      <div className="orden-controles">
        <input
            type="text"
            placeholder="Buscar por N° orden o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="TODOS">Todas</option>
            <option value="CON">Con factura</option>
            <option value="SIN">Sin factura</option>
        </select>
        <label className="fecha">Desde:
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label className="fecha">Hasta:
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button onClick={buscar}>Filtrar</button>
      </div>

      {cargando ? <p>Cargando...</p> : (
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr><th>N° Orden</th><th>Fecha</th><th>Proveedor</th><th>Factura</th><th>N° Factura</th><th></th></tr>
            </thead>
            <tbody>
              {filtradas.map((o) => (
                <tr key={o.numero}>
                  <td>{o.numero}</td>
                  <td>{new Date(o.fechaEmitido).toLocaleDateString()}</td>
                  <td>{o.proveedor}</td>
                  <td>
                    <span className={o.estadoFactura === 'CON FACTURA' ? 'badge-con' : 'badge-sin'}>
                      {o.estadoFactura}
                    </span>
                  </td>
                  <td>{o.nroFactura || '-'}</td>
                  <td><button onClick={() => verDetalle(o.numero)}>Ver</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EstadoOrden;