import type { Vale } from '../../types/vale';

interface Props {
  vales: Vale[];
  descargando: string;
  onDescargar: (numero: string) => void;
}

function TablaReporteVale({ vales, descargando, onDescargar }: Props) {
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr><th>N° Vale</th><th>Fecha</th><th>Solicitado por</th><th>Entregado por</th><th>Reporte</th></tr>
        </thead>
        <tbody>
          {vales.map((v) => (
            <tr key={v.numero}>
              <td>{v.numero}</td>
              <td>{v.fechaSolicitado ? new Date(v.fechaSolicitado).toLocaleDateString() : ''}</td>
              <td>{v.solicitadoPor}</td>
              <td>{v.entregadoPor}</td>
              <td>
                <button className="btn-pdf" disabled={descargando === v.numero}
                  onClick={() => onDescargar(v.numero)}>
                  {descargando === v.numero ? 'Generando...' : 'PDF'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaReporteVale;