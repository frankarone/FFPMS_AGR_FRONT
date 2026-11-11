import { Link } from 'react-router-dom';
import { FaFileExcel } from 'react-icons/fa';
import MenuAsistencia from '../../components/asistencia/MenuAsistencia';
import { useReporteAsistencia } from '../../hooks/useReporteAsistencia';
import { formatearFecha } from '../../utils/fecha';
import './AsistenciaInicio.css';
import './PlantillaProceso.css';
import './VerAsistencia.css';

const ESTADO_TEXTO: Record<string, string> = { PRESENTE: 'PRESENTE', AUSENTE: 'AUSENTE', PENDIENTE: 'SIN MARCAR' };

function VerAsistencia() {
  const {
    fecha, setFecha, naveId, setNaveId, naves, reporte, cargando, descargando, error, descargar, hoy,
  } = useReporteAsistencia();

  return (
    <div className="asis-inicio">
      <MenuAsistencia />

      <div className="plan-cabecera">
        <Link to="/asistencia" className="asis-boton asis-boton-plantilla plan-principal">PRINCIPAL</Link>
        <h1 className="asis-titulo">VER ASISTENCIA</h1>
      </div>

      <div className="plan-form">
        <div className="plan-fila">
          <label>Fecha :</label>
          <input type="date" value={fecha} max={hoy} onChange={(e) => setFecha(e.target.value)} />

          <label>Nave de proceso :</label>
          <select value={naveId ?? ''} onChange={(e) => setNaveId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">-- Seleccionar --</option>
            {naves.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
          </select>

          <button className="ver-excel" disabled={!reporte || descargando} onClick={descargar}>
            <FaFileExcel /> {descargando ? 'DESCARGANDO...' : 'DESCARGAR EXCEL'}
          </button>
        </div>
      </div>

      {error && <p className="asis-error">{error}</p>}
      {naveId === null && <p className="asis-vacio">Elige la fecha y la nave para ver el reporte.</p>}
      {cargando && <p className="asis-vacio">Cargando...</p>}

      {reporte && !cargando && (
        <>
          <div className="ver-resumen">
            <h2>{reporte.nave} · {formatearFecha(reporte.fecha)}</h2>
            <div className="ver-totales">
              <span>Total estimado <b>{reporte.totalEstimado}</b></span>
              <span>Asistieron <b className="ver-ok">{reporte.asistieron}</b></span>
              <span>Ausentes <b className="ver-mal">{reporte.ausentes}</b></span>
              <span>Sin marcar <b>{reporte.pendientes}</b></span>
            </div>
          </div>

          {reporte.areas.length === 0 ? (
            <p className="asis-vacio">No hay asistencia registrada para esa nave en esa fecha.</p>
          ) : (
            reporte.areas.map((a) => (
              <section key={a.areaId} className="ver-area">
                <div className="ver-area-cabecera">
                  <span className="ver-area-nombre">{a.area}</span>
                  <span>TOTAL ESTIMADO <b>{a.totalEstimado ?? '-'}</b></span>
                  <span>ASISTIERON <b className="ver-ok">{a.asistieron}</b></span>
                  {a.ausentes > 0 && <span>AUSENTES <b className="ver-mal">{a.ausentes}</b></span>}
                  {a.pendientes > 0 && <span>SIN MARCAR <b>{a.pendientes}</b></span>}
                </div>

                {a.personas.length === 0 ? (
                  <p className="ver-sin">Sin personas registradas</p>
                ) : (
                  <div className="ver-scroll">
                    <table className="ver-tabla">
                      <thead>
                        <tr><th>#</th><th>DNI</th><th>Apellidos y nombres</th><th>Área</th><th>Estado</th><th>Observación</th></tr>
                      </thead>
                      <tbody>
                        {a.personas.map((p, i) => (
                          <tr key={`${p.dni}-${i}`}>
                            <td>{i + 1}</td>
                            <td>{p.dni}</td>
                            <td>{p.nombre}</td>
                            <td>{p.area}</td>
                            <td>
                              <span className={`ver-estado ver-estado-${p.estado.toLowerCase()}`}>
                                {ESTADO_TEXTO[p.estado] ?? p.estado}
                              </span>
                            </td>
                            <td>{p.observacion || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default VerAsistencia;