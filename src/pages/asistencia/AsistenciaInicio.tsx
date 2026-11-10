import { FaUsers, FaUserCheck, FaUserTimes, FaPercent, FaUserClock} from 'react-icons/fa';
import { useDashboardAsistencia } from '../../hooks/useDashboardAsistencia';
import TarjetaResumen from '../../components/asistencia/TarjetaResumen';
import GraficoPorNave from '../../components/asistencia/GraficoPorNave';
import GraficoAsistenciaDia from '../../components/asistencia/GraficoAsistenciaDia';
import GraficoAusentesPorArea from '../../components/asistencia/GraficoAusentesPorArea';
import GraficoUltimos7Dias from '../../components/asistencia/GraficoUltimos7Dias';
import { formatearFecha } from '../../utils/fecha';
import MenuAsistencia from '../../components/asistencia/MenuAsistencia';
import './AsistenciaInicio.css';

function AsistenciaInicio() {
    const { fecha, naveId, setNaveId, naves, naveNombre, datos, cargando, error, actualizado } = useDashboardAsistencia();

  return (
    <div className="asis-inicio">
            <MenuAsistencia />

      <h1 className="asis-titulo">ASISTENCIA PROCESO</h1>

      <div className="asis-filtros">
        <span className="asis-fecha">Hoy: {formatearFecha(fecha)}</span>
        <select
          className="asis-select-nave"
          value={naveId ?? ''}
          onChange={(e) => setNaveId(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">TODAS LAS NAVES</option>
          {naves.map((n) => (
            <option key={n.id} value={n.id}>{n.nombre}</option>
          ))}
        </select>
      </div>
        
      {actualizado && (
        <p className="asis-actualizado">
          Actualizado {actualizado.toLocaleTimeString()} · se actualiza solo cada 30 segundos
        </p>
      )}
      {cargando && 
        <p className="asis-vacio">Cargando...</p>}
      {error && 
        <p className="asis-error">{error}</p>}

      {datos && !cargando && (
        <>
          <section className="asis-tarjetas">
            <TarjetaResumen titulo="Personal del día" valor={datos.resumen.total} icono={<FaUsers />} color="#455a64" />
            <TarjetaResumen titulo="Presentes" valor={datos.resumen.presentes} icono={<FaUserCheck />} color="#43a047" />
            <TarjetaResumen titulo="Ausentes" valor={datos.resumen.ausentes} icono={<FaUserTimes />} color="#e53935" />
            <TarjetaResumen titulo="Sin marcar" valor={datos.resumen.pendientes} icono={<FaUserClock />} color="#757575" />
            <TarjetaResumen titulo="% Asistencia" valor={`${datos.resumen.porcentaje}%`} icono={<FaPercent />} color="#00acc1" />
          </section>

          <section className="asis-graficos">
            {naveId === null ? (
              <GraficoPorNave datos={datos.porNave} />
            ) : (
              <GraficoAsistenciaDia
                titulo={`Asistencia ${naveNombre} – hoy`}
                presentes={datos.resumen.presentes}
                ausentes={datos.resumen.ausentes}
                pendientes={datos.resumen.pendientes}
                porcentaje={datos.resumen.porcentaje}
              />
            )}
            <GraficoAusentesPorArea titulo={`Ausentes por área – ${naveNombre}`} datos={datos.porArea} />
            <GraficoUltimos7Dias titulo={`Últimos 7 días – ${naveNombre}`} datos={datos.ultimos7Dias} />
          </section>
        </>
      )}
    </div>
  );
}

export default AsistenciaInicio;