import { useEffect, useState } from 'react';
import { listarOrdenes, descargarOrdenPdf } from '../../services/ordenService';
import type { Orden } from '../../types/orden';
import './ReporteOrden.css';


function ReporteOrden() {
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

  return (
    <div className="reporte-contenedor">
      <h1 className="reporte-titulo">REPORTE ORDEN DE COMPRA</h1>

      <div className="reporte-controles">
        <input
          type="text"
          placeholder="Buscar por N° orden o proveedor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <label>Desde: <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
        <label>Hasta: <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
        <button onClick={buscar}>Filtrar</button>
      </div>

      {cargando ? <p>Cargando...</p> : (
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr><th>N° Orden</th><th>Fecha</th><th>Proveedor</th><th>Factura</th><th>Reporte</th></tr>
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
                  <td>
                    <button
                      className="btn-pdf"
                      disabled={descargando === o.numero}
                      onClick={() => descargar(o.numero)}
                    >
                      {descargando === o.numero ? 'Generando...' : 'PDF'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReporteOrden;