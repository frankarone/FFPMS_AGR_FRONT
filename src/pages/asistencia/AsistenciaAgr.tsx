import { Link } from 'react-router-dom';
import MenuAsistencia from '../../components/asistencia/MenuAsistencia';
import TarjetaAreaAsistencia from '../../components/asistencia/TarjetaAreaAsistencia';
import ModalAsistencia from '../../components/asistencia/ModalAsistencia';
import { useAsistenciaAgr } from '../../hooks/useAsistenciaAgr';
import { formatearFecha } from '../../utils/fecha';
import './AsistenciaInicio.css';
import './PlantillaProceso.css';
import './AsistenciaAgr.css';

function AsistenciaAgr() {
  const a = useAsistenciaAgr();

  return (
    <div className="asis-inicio">
      <MenuAsistencia />

      <div className="plan-cabecera">
        <Link to="/asistencia" className="asis-boton asis-boton-plantilla plan-principal">PRINCIPAL</Link>
        <h1 className="asis-titulo">ASISTENCIA PROCESO</h1>
      </div>
      <p className="asis-fecha plan-fecha">Hoy: {formatearFecha(a.fecha)}</p>

      <div className="plan-form">
        <div className="plan-fila">
          <label>Nave de proceso :</label>
          <select value={a.naveId ?? ''} onChange={(e) => a.setNaveId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">-- Seleccionar --</option>
            {a.naves.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
          </select>

          <label>DNI / Código :</label>
          <input
            type="text"
            placeholder="Escanea o escribe el DNI + Enter"
            value={a.dni}
            disabled={a.naveId === null}
            onChange={(e) => a.setDni(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') a.marcarPorDni(); }}
          />
          <button className="plan-agregar" disabled={a.naveId === null} onClick={() => a.marcarPorDni()}>MARCAR</button>
        </div>
      </div>

      {a.error && <p className="asis-error">{a.error}</p>}
      {a.mensaje && <p className="plan-mensaje">{a.mensaje}</p>}

      <section className="plan-panel">
        {a.naveId === null ? (
          <p className="asis-vacio">Selecciona una nave de proceso para pasar lista.</p>
        ) : a.tarjetas.length === 0 ? (
          <p className="asis-vacio">Esta nave no tiene plantilla. Ármala primero en PLANTILLA.</p>
        ) : (
          <>
            <p className="plan-total-nave">Presentes en la nave: <b>{a.presentesNave}/{a.puestosNave}</b></p>
            <div className="plan-tarjetas">
              {a.tarjetas.map((t) => (
                <TarjetaAreaAsistencia
                  key={t.area.id}
                  area={t.area.nombre}
                  items={t.items}
                  presentes={t.presentes}
                  puestos={t.cupo}
                  libres={t.cupo - t.activos}
                  guardada={t.guardada}
                  onGuardar={() => a.guardarArea(t.area.id)}
                  onEditar={() => a.editarArea(t.area.id)}
                  onPresente={a.marcarPresente}
                  onX={a.abrirModal}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {a.paso && <ModalAsistencia a={a} />}
    </div>
  );
}

export default AsistenciaAgr;