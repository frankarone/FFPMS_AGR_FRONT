import type { PersonalListado, PersonalPeriodo } from '../../types/personal';
import { formatearFecha } from '../../utils/fecha';

interface Props {
  modo: string;
  persona: PersonalListado;
  historial: PersonalPeriodo[];
  fecha: string;
  setFecha: (v: string) => void;
  motivo: string;
  setMotivo: (v: string) => void;
  onConfirmar: () => void;
  onCerrar: () => void;
}

function PersonalModal({ modo, persona, historial, fecha, setFecha, motivo, setMotivo, onConfirmar, onCerrar }: Props) {
  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
        <button className="modal-cerrar" onClick={onCerrar}>✕</button>

        {modo === 'cesar' && (
          <>
            <h3>Cesar a {persona.nombres} {persona.apellidos}</h3>
            <label className="modal-campo">Fecha de cese
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </label>
            <label className="modal-campo">Motivo
              <input type="text" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej: Fin de contrato" />
            </label>
            <button className="btn-cesar" onClick={onConfirmar}>Confirmar cese</button>
          </>
        )}

        {modo === 'reingresar' && (
          <>
            <h3>Reingresar a {persona.nombres} {persona.apellidos}</h3>
            <label className="modal-campo">Fecha de ingreso
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </label>
            <button className="btn-reingresar" onClick={onConfirmar}>Confirmar reingreso</button>
          </>
        )}

        {modo === 'historial' && (
          <>
            <h3>Historial de {persona.nombres} {persona.apellidos}</h3>
            {historial.length === 0 ? (
              <p>Sin períodos registrados.</p>
            ) : (
              <table className="tabla">
                <thead><tr><th>Ingreso</th><th>Cese</th><th>Motivo</th></tr></thead>
                <tbody>
                  {historial.map((h) => (
                    <tr key={h.id}>
                      <td>{formatearFecha(h.fechaIngreso)}</td>
                      <td>{h.fechaCese ? formatearFecha(h.fechaCese) : <span className="af-con">ACTUAL</span>}</td>
                      <td>{formatearFecha(h.fechaCese) || <span className="af-con">ACTUAL</span>}</td>
                      <td>{h.motivoCese || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PersonalModal;