import type { Orden } from '../../types/orden';
import { formatearFecha } from '../../utils/fecha';

interface Props {
  ordenes: Orden[];
  onVerDetalle: (numero: string) => void;
}

function TablaOrdenes({ ordenes, onVerDetalle }: Props) {
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr><th>N° Orden</th><th>Fecha</th><th>Proveedor</th><th>Factura</th><th>N° Factura</th><th></th></tr>
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
              <td>{o.nroFactura || '-'}</td>
              <td><button onClick={() => onVerDetalle(o.numero)}>Ver</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaOrdenes;