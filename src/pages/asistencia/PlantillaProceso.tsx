import { Link } from 'react-router-dom';
import MenuAsistencia from '../../components/asistencia/MenuAsistencia';
import TarjetaAreaPlantilla from '../../components/asistencia/TarjetaAreaPlantilla';
import { usePlantilla } from '../../hooks/usePlantilla';
import { formatearFecha } from '../../utils/fecha';
import './AsistenciaInicio.css';
import './PlantillaProceso.css';

function PlantillaProceso() {
  const {
    naves, areas, naveId, setNaveId,
    dni, setDni, persona, areaId, setAreaId,
    agregar, quitar, guardarArea, editarArea,
    tarjetas, totalNave, fechaPlantilla, mensaje, error,
  } = usePlantilla();

  const dniCompleto = dni.trim().length >= 8;

  return (
    <div className="asis-inicio">
      <MenuAsistencia />

      <div className="plan-cabecera">
        <Link to="/asistencia" className="asis-boton asis-boton-plantilla plan-principal">PRINCIPAL</Link>
        <h1 className="asis-titulo">PLANTILLA PROCESO</h1>
      </div>
      <p className="asis-fecha plan-fecha">Plantilla para el día: {formatearFecha(fechaPlantilla)}</p>

      <div className="plan-form">
        <div className="plan-fila">
          <label>Nave de proceso :</label>
          <select value={naveId ?? ''} onChange={(e) => setNaveId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">-- Seleccionar --</option>
            {naves.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
          </select>
        </div>

        <div className="plan-fila">
          <label>DNI Operador :</label>
          <div className="plan-dni">
            <input
              type="text"
              placeholder="Escribe o escanea el DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') agregar(); }}
            />
            {dniCompleto && (persona ? (
              persona.activo
                ? <span className="plan-ok">✓ {persona.apellidos} {persona.nombres}</span>
                : <span className="plan-cesado">✗ CESADO – {persona.apellidos} {persona.nombres}</span>
            ) : (
              <span className="plan-cesado">✗ DNI no registrado</span>
            ))}
          </div>

          <label>Área :</label>
          <select value={areaId ?? ''} onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : null)}>
            <option value="">-- Seleccionar --</option>
            {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>

          <button className="plan-agregar" onClick={agregar}>AGREGAR</button>
        </div>
      </div>

      {error && <p className="asis-error">{error}</p>}
      {mensaje && <p className="plan-mensaje">{mensaje}</p>}

      <section className="plan-panel">
        {naveId === null ? (
          <p className="asis-vacio">Selecciona una nave de proceso para ver su plantilla.</p>
        ) : tarjetas.length === 0 ? (
          <p className="asis-vacio">Esta nave aún no tiene personal en su plantilla.</p>
        ) : (
          <>
            <p className="plan-total-nave">Total en la nave: <b>{totalNave}</b></p>
            <div className="plan-tarjetas">
              {tarjetas.map((t) => (
                <TarjetaAreaPlantilla
                  key={t.area.id}
                  area={t.area.nombre}
                  items={t.items}
                  guardada={t.guardada}
                  onGuardar={() => guardarArea(t.area.id)}
                  onEditar={() => editarArea(t.area.id)}
                  onQuitar={quitar}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default PlantillaProceso;