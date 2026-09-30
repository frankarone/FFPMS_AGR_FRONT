import type { Orden } from '../../types/orden';
import { formatearFecha } from '../../utils/fecha';
interface Props {
  ordenes: Orden[];
  descargando: string;
  onDescargar: (numero: string) => void;
}

function TablaReporteOrden({ ordenes, descargando, onDescargar }: Props) {
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr><th>N° Orden</th><th>Fecha</th><th>Proveedor</th><th>Factura</th><th>Reporte</th></tr>
        </thead>
        <tbody>
          {ordenes.map((o) => (
            <tr key={o.numero}>
              <td>{o.numero}</td>
              <td>{formatearFecha(o.fechaEmitido)}</td>
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
                  onClick={() => onDescargar(o.numero)}
                >
                  {descargando === o.numero ? 'Generando...' : 'PDF'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaReporteOrden;