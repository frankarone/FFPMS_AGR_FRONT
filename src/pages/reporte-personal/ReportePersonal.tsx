import { useReportePersonal } from '../../hooks/useReportePersonal';
import { formatearFecha } from '../../utils/fecha';
import './ReportePersonal.css';

function ReportePersonal() {
  const {
    areas, tipos, datos, cargando, buscado, descargando,
    campoFecha, setCampoFecha, desde, setDesde, hasta, setHasta,
    areaId, setAreaId, tipoPersonalId, setTipoPersonalId, estado, setEstado,
    buscar, exportar, limpiar,
  } = useReportePersonal();

  return (
    <div className="repper-contenedor">
      <h1 className="repper-titulo">REPORTE DE PERSONAL</h1>

      <div className="repper-filtros">
        <div className="repper-fila">
          <label>Filtrar por fecha
            <select value={campoFecha} onChange={(e) => setCampoFecha(e.target.value)}>
              <option value="">(ninguna)</option>
              <option value="registro">Fecha de registro</option>
              <option value="ingreso">Fecha de ingreso</option>
              <option value="cese">Fecha de cese</option>
            </select>
          </label>
          <label>Desde
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} disabled={!campoFecha} />
          </label>
          <label>Hasta
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} disabled={!campoFecha} />
          </label>
        </div>

        <div className="repper-fila">
          <label>Área
            <select value={areaId ?? ''} onChange={(e) => setAreaId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Todas</option>
              {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
            </select>
          </label>
          <label>Tipo de personal
            <select value={tipoPersonalId ?? ''} onChange={(e) => setTipoPersonalId(e.target.value ? Number(e.target.value) : null)}>
              <option value="">Todos</option>
              {tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </select>
          </label>
          <label>Estado
            <select value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </label>
        </div>

        <div className="repper-botones">
          <button className="btn-buscar" onClick={buscar}>Buscar</button>
          <button className="btn-limpiar" onClick={limpiar}>Limpiar</button>
          <button className="btn-excel" onClick={exportar} disabled={!buscado || datos.length === 0 || descargando}>
            {descargando ? 'Generando...' : 'Exportar Excel'}
          </button>
        </div>
      </div>

      {cargando ? <p>Cargando...</p> : (
        buscado && datos.length === 0
          ? <p className="repper-vacio">No hay resultados con esos filtros.</p>
          : (
            <div className="repper-tabla-wrap">
              <table className="tabla">
                <thead>
                  <tr>
                    <th>#</th><th>DNI</th><th>Nombres</th><th>Apellidos</th>
                    <th>Cargo</th><th>Área</th><th>Tipo</th><th>Grado</th>
                    <th>Celular</th><th>Sueldo</th><th>Seguro</th>
                    <th>F. Ingreso</th><th>F. Cese</th><th>F. Registro</th><th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map((p, i) => (
                    <tr key={p.dni + i}>
                      <td>{i + 1}</td>
                      <td>{p.dni}</td>
                      <td>{p.nombres}</td>
                      <td>{p.apellidos}</td>
                      <td>{p.cargo}</td>
                      <td>{p.area}</td>
                      <td>{p.tipoPersonal || '-'}</td>
                      <td>{p.gradoInstruccion || '-'}</td>
                      <td>{p.celular || '-'}</td>
                      <td>{p.sueldo != null ? Number(p.sueldo).toFixed(2) : '-'}</td>
                      <td>{p.tieneSeguro ? (p.sistemaPension || 'Sí') : 'No'}</td>
                      <td>{formatearFecha(p.fechaIngreso)}</td>
                      <td>{formatearFecha(p.fechaCese)}</td>
                      <td>{formatearFecha(p.fechaRegistro)}</td>
                      <td><span className={p.activo ? 'rep-activo' : 'rep-inactivo'}>{p.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
      )}
    </div>
  );
}

export default ReportePersonal;