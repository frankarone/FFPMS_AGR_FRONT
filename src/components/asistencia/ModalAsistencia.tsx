import type { useAsistenciaAgr } from '../../hooks/useAsistenciaAgr';
import { textoUbicacion } from '../../hooks/useAsistenciaAgr';
import { MOTIVOS_INASISTENCIA } from '../../services/asistenciaDiaService';

type Asis = ReturnType<typeof useAsistenciaAgr>;

function ModalAsistencia({ a }: { a: Asis }) {
  const persona = a.itemModal ?? a.personaMover;
  if (!persona) return null;
  const item = a.itemModal;

  const selectorMotivo = item && (
    <label className="agr-modal-campo">
      Motivo de inasistencia de {item.apellidos} {item.nombres}
      <select value={a.motivo} onChange={(e) => a.setMotivo(e.target.value)}>
        <option value="">-- Seleccionar --</option>
        {MOTIVOS_INASISTENCIA.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
    </label>
  );

  const error = a.errorModal && <p className="agr-modal-error">{a.errorModal}</p>;

  return (
    <div className="agr-modal-fondo" onClick={a.cerrarModal}>
      <div className="agr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="agr-modal-cerrar" onClick={a.cerrarModal}>✕</button>
        <h3>{persona.apellidos} {persona.nombres}</h3>
        <p className="agr-modal-sub">
          DNI {persona.dni}{item ? ` · ${item.area}` : ''}{item?.servis ? ' · SERVIS' : ''}
        </p>

        {/* --- X: elegir qué hacer --- */}
        {a.paso === 'opciones' && item && (
          <div className="agr-modal-opciones">
              {item.estado === 'AUSENTE' && (
                 <button className="agr-btn agr-btn-guardar" onClick={a.deshacerInasistencia}>QUITAR INASISTENCIA</button>
                )}
                {item.reemplazadoPor === null && (
                  <button className="agr-btn agr-btn-cambiar" onClick={() => a.irA('cambiar')}>CAMBIAR PERSONAL</button>
                )}
                <button className="agr-btn agr-btn-mover" onClick={a.irMoverDesdeItem}>CAMBIAR DE ÁREA</button>
                <button className="agr-btn agr-btn-inasistencia" onClick={() => a.irA('inasistencia')}>INASISTENCIA</button>
                {item.esReemplazo && (
                  <button className="agr-btn agr-btn-quitar" onClick={a.quitarReemplazo}>QUITAR REEMPLAZO</button>
            )}
            {error}
          </div>
        )}

        {/* --- Inasistencia --- */}
        {a.paso === 'inasistencia' && item && (
          <>
            {selectorMotivo}
            {error}
            <div className="agr-modal-acciones">
              <button className="agr-btn agr-btn-volver" onClick={() => a.irA('opciones')}>VOLVER</button>
              <button className="agr-btn agr-btn-guardar" onClick={a.confirmarInasistencia}>GUARDAR</button>
            </div>
          </>
        )}

        {/* --- Cambiar personal (reemplazo) --- */}
        {a.paso === 'cambiar' && item && (
          <>
            <label className="agr-modal-campo">
              Buscar reemplazo (DNI, código de barras o nombre)
              <div className="agr-modal-buscar">
                <input
                  autoFocus
                  value={a.busqueda}
                  placeholder="Ej: 70000137 o QUISPE"
                  onChange={(e) => a.setBusqueda(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') a.buscarReemplazo(); }}
                />
                <button className="agr-btn agr-btn-cambiar" onClick={a.buscarReemplazo}>BUSCAR</button>
              </div>
            </label>

            {a.resultados.length > 0 && (
              <ul className="agr-resultados">
                {a.resultados.map((p) => (
                  <li
                    key={p.personalId}
                    className={a.elegido?.personalId === p.personalId ? 'agr-resultado-elegido' : ''}
                    onClick={() => a.elegirReemplazo(p)}
                  >
                    <span><small>{p.dni}</small>{p.apellidos} {p.nombres}</span>
                    {!p.activo && <span className="agr-tag agr-tag-ausente">CESADO</span>}
                  </li>
                ))}
              </ul>
            )}

            {a.elegido && (
              <>
                <p className="agr-elegido">
                  Reemplazo: <b>{a.elegido.apellidos} {a.elegido.nombres}</b> (DNI {a.elegido.dni})
                </p>
                {a.ubicacion && (
                  <p className="agr-ubicacion">
                    ⚠ Está en: <b>{textoUbicacion(a.ubicacion)}</b>. Al guardar se moverá a {item.area}.
                  </p>
                )}
                <label className="agr-check-servis">
                  <input type="checkbox" checked={a.esServis} onChange={(e) => a.setEsServis(e.target.checked)} />
                  Pertenece a SERVIS
                </label>
              </>
            )}

            {selectorMotivo}
            {error}
            <div className="agr-modal-acciones">
              <button className="agr-btn agr-btn-volver" onClick={() => a.irA('opciones')}>VOLVER</button>
              <button className="agr-btn agr-btn-guardar" onClick={a.confirmarCambio}>GUARDAR</button>
            </div>
          </>
        )}

        {/* --- Cambiar de área / nave --- */}
        {a.paso === 'mover' && (
          <>
            <p className="agr-ubicacion">
              {a.ubicacion
                ? <>Está en: <b>{textoUbicacion(a.ubicacion)}</b></>
                : 'No está asignado en ninguna nave hoy.'}
            </p>

            <label className="agr-modal-campo">
              Mover a nave
              <select
                value={a.destinoNaveId ?? ''}
                onChange={(e) => { a.setDestinoNaveId(e.target.value ? Number(e.target.value) : null); a.setDestinoAreaId(null); }}
              >
                {a.naves.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
              </select>
            </label>

            <label className="agr-modal-campo">
              Mover a área
              <select
                value={a.destinoAreaId ?? ''}
                onChange={(e) => a.setDestinoAreaId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">-- Seleccionar --</option>
                {a.areasDestino.map((ar) => (
                  <option key={ar.id} value={ar.id} disabled={ar.libres <= 0}>
                    {ar.nombre} — {ar.libres > 0 ? `${ar.libres} libre(s)` : 'completa'}
                  </option>
                ))}
              </select>
            </label>
            {a.areasDestino.length === 0 && <p className="agr-modal-error">Esa nave no tiene plantilla.</p>}

            {error}
            <div className="agr-modal-acciones">
              {item && <button className="agr-btn agr-btn-volver" onClick={() => a.irA('opciones')}>VOLVER</button>}
              <button className="agr-btn agr-btn-guardar" onClick={a.confirmarMover}>MOVER</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalAsistencia;