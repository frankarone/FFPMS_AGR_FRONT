import type { DetalleOrden as DetalleOrdenType } from '../../types/orden';
import { formatearFecha } from '../../utils/fecha';

interface Props {
  detalle: DetalleOrdenType;
  onVolver: () => void;
}

function DetalleOrden({ detalle, onVolver }: Props) {
  const o = detalle.orden;
  return (
    <div className="orden-contenedor">
      <button className="btn-volver" onClick={onVolver}>Regresar</button>
      <h2>Orden {o.numero}</h2>
      <div className="orden-cabecera">
        <p><b>Proveedor:</b> {o.proveedor} ({o.ruc})</p>
        <p><b>Fecha:</b> {formatearFecha(o.fechaEmitido)}</p>
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

export default DetalleOrden;