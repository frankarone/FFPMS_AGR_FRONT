import type { ItemAsistencia } from '../../types/asistencia';

interface Props {
  area: string;
  items: ItemAsistencia[];
  presentes: number;
  puestos: number;
  libres: number;
  guardada: boolean;
  onGuardar: () => void;
  onEditar: () => void;
  onPresente: (item: ItemAsistencia) => void;
  onX: (item: ItemAsistencia) => void;
}

function TarjetaAreaAsistencia({ area, items, presentes, puestos, libres, guardada, onGuardar, onEditar, onPresente, onX }: Props) {
  return (
    <div className={`plan-tarjeta ${guardada ? 'plan-tarjeta-guardada' : ''}`}>
      <div className="plan-tarjeta-cabecera">
        <span className="plan-tarjeta-area">{area}</span>
        <span className="plan-tarjeta-total">TOTAL <b>{presentes}/{puestos}</b></span>
        {libres > 0 && !guardada && <span className="agr-libres">{libres} libre{libres > 1 ? 's' : ''}</span>}
        {guardada ? (
          <button className="plan-btn-editar" onClick={onEditar}>EDITAR</button>
        ) : (
          <button className="plan-btn-guardar" onClick={onGuardar}>GUARDAR</button>
        )}
      </div>

      <div className="agr-cuerpo">
        <table className="agr-tabla">
          <tbody>
            {items.map((i) => (
              <tr key={i.personalId} className={i.reemplazadoPor !== null ? 'agr-reemplazado' : ''}>
                <td className="agr-nombre">
                  {i.esReemplazo && <span className="agr-flecha">↳ </span>}
                  <span className="agr-nombre-texto">{i.apellidos} {i.nombres}</span>
                  <div className="agr-etiquetas">
                    {i.servis && <span className="agr-tag agr-tag-servis">SERVIS</span>}
                    {i.esReemplazo && <span className="agr-tag agr-tag-reemplazo">REEMPLAZO</span>}
                    {i.movidoDe && <span className="agr-tag agr-tag-movido">DE {i.movidoDe}</span>}
                    {i.estado === 'AUSENTE' && <span className="agr-tag agr-tag-ausente">{i.motivo}</span>}
                  </div>
                </td>
                <td className="agr-celda">
                  <button
                    className={`agr-check ${i.estado === 'PRESENTE' ? 'agr-check-activo' : ''}`}
                    title="Presente"
                    disabled={guardada}
                    onClick={() => onPresente(i)}
                  >✓</button>
                </td>
                <td className="agr-celda">
                  <button
                    className={`agr-x ${i.estado === 'AUSENTE' ? 'agr-x-activo' : ''}`}
                    title="No asistió / cambiar"
                    disabled={guardada}
                    onClick={() => onX(i)}
                  >X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {guardada && <p className="plan-guardada-texto">✓ Asistencia guardada</p>}
    </div>
  );
}

export default TarjetaAreaAsistencia;