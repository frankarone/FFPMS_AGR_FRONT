import { useRegistroPersonal } from '../../hooks/useRegistroPersonal';
import TablaPersonal from '../../components/registro/TablaPersonal';
import PersonalModal from '../../components/registro/PersonalModal';
import BotonSubir from '../../components/registro/BotonSubir';
import './RegistroPersonal.css';

const ESTADOS_CIVILES = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Conviviente'];
const TIPOS_DOC = [
  { tipo: 'CV', label: 'CV' },
  { tipo: 'COPIA_DNI', label: 'Copia DNI / Extranjería' },
  { tipo: 'RECIBO', label: 'Recibo' },
  { tipo: 'ANT_POLICIAL', label: 'Antecedente policial' },
  { tipo: 'IDENT_MENOR', label: 'Identificación del menor' }, 
];


function RegistroPersonal() {
  const {
    form, setCampo, asignacionFamiliar,
    cargos, areas, tipos, nacionalidades, grados,bancos,
    filtradas, busqueda, setBusqueda,
    filtroTipo, setFiltroTipo,
    campoFecha, setCampoFecha, fDesde, setFDesde, fHasta, setFHasta,
    editarId, editar, cancelarEdicion, eliminar,
    mensaje, error, guardando, guardar,
    modalModo, modalPersona, modalFecha, setModalFecha, modalMotivo, setModalMotivo, historial,
    abrirModal, cerrarModal, confirmarAccion,
    documentos, subirDoc, verDoc, eliminarDoc,
  } = useRegistroPersonal();

  return (
    <div className="registro-contenedor">
      <h1 className="registro-titulo">{editarId ? 'EDITAR PERSONAL' : 'REGISTRO DE PERSONAL'}</h1>

      <div className="registro-form">
        {/* Datos personales */}
        <fieldset className="registro-bloque">
          <legend>Datos personales</legend>
          <div className="registro-grid">
            <label>DNI / EXTRANJERIA *
              <input type="text" value={form.dni} maxLength={15} onChange={(e) => setCampo('dni', e.target.value)} />
            </label>
            <label>Nombres *
              <input type="text" value={form.nombres} onChange={(e) => setCampo('nombres', e.target.value)} />
            </label>
            <label>Apellidos *
              <input type="text" value={form.apellidos} onChange={(e) => setCampo('apellidos', e.target.value)} />
            </label>
            <label>Sexo
              <select value={form.sexo} onChange={(e) => setCampo('sexo', e.target.value)}>
                <option>Masculino</option>
                <option>Femenino</option>
              </select>
            </label>
            <label>Estado civil
              <select value={form.estadoCivil} onChange={(e) => setCampo('estadoCivil', e.target.value)}>
                {ESTADOS_CIVILES.map((ec) => <option key={ec}>{ec}</option>)}
              </select>
            </label>
          </div>
        </fieldset>

        {/* Remuneración y sistema pensionario */}
        <fieldset className="registro-bloque">
          <legend>Remuneración y seguro</legend>
          <div className="registro-grid">
            <label>Sueldo
              <input type="number" step="0.01" min="0" value={form.sueldo ?? ''}
                onChange={(e) => setCampo('sueldo', e.target.value === '' ? null : Number(e.target.value))} />
            </label>

            <label>Banco
              <select value={form.bancoId ?? ''} onChange={(e) => setCampo('bancoId', e.target.value ? Number(e.target.value) : null)}>
                <option value="">-- Seleccionar --</option>
                {bancos.map((bk) => <option key={bk.id} value={bk.id}>{bk.nombre}</option>)}
              </select>
            </label>

            <label>N° de cuenta
              <input type="text" value={form.nroCuenta} maxLength={30}
                onChange={(e) => setCampo('nroCuenta', e.target.value)} />
            </label>

            <label className="registro-check">
              <input type="checkbox" checked={form.tieneSeguro}
                onChange={(e) => { const on = e.target.checked; setCampo('tieneSeguro', on); if (!on) setCampo('sistemaPension', ''); }} />
              ¿Cuenta con seguro / pensión?
            </label>

            {form.tieneSeguro && (
              <label>Sistema
                <select value={form.sistemaPension} onChange={(e) => setCampo('sistemaPension', e.target.value)}>
                  <option value="">-- Seleccionar --</option>
                  <option value="AFP">AFP</option>
                  <option value="ONP">ONP</option>
                </select>
              </label>
            )}
          </div>
        </fieldset>

        {/* Clasificación (maestros) */}
        <fieldset className="registro-bloque">
          <legend>Clasificación</legend>
          <div className="registro-grid">
            <label>Cargo *
              <select value={form.cargoId ?? ''} onChange={(e) => setCampo('cargoId', e.target.value ? Number(e.target.value) : null)}>
                <option value="">-- Seleccionar --</option>
                {cargos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </label>
            <label>Área *
              <select value={form.areaId ?? ''} onChange={(e) => setCampo('areaId', e.target.value ? Number(e.target.value) : null)}>
                <option value="">-- Seleccionar --</option>
                {areas.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </label>
            <label>Tipo de personal
              <select value={form.tipoPersonalId ?? ''} onChange={(e) => setCampo('tipoPersonalId', e.target.value ? Number(e.target.value) : null)}>
                <option value="">-- Seleccionar --</option>
                {tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </label>
            <label>Nacionalidad
              <select value={form.nacionalidadId ?? ''} onChange={(e) => setCampo('nacionalidadId', e.target.value ? Number(e.target.value) : null)}>
                <option value="">-- Seleccionar --</option>
                {nacionalidades.map((n) => <option key={n.id} value={n.id}>{n.nombre}</option>)}
              </select>
            </label>
            <label>Grado de instrucción
              <select value={form.gradoInstruccionId ?? ''} onChange={(e) => setCampo('gradoInstruccionId', e.target.value ? Number(e.target.value) : null)}>
                <option value="">-- Seleccionar --</option>
                {grados.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>
            </label>
          </div>
        </fieldset>

        {/* Contacto */}
        <fieldset className="registro-bloque">
          <legend>Contacto</legend>
          <div className="registro-grid">
            <label>Correo electrónico
              <input type="email" value={form.correoElectronico} onChange={(e) => setCampo('correoElectronico', e.target.value)} />
            </label>
            <label>N° Celular
              <input type="text" value={form.celular} maxLength={20} onChange={(e) => setCampo('celular', e.target.value)} />
            </label>
            <label>Domicilio
              <input type="text" value={form.domicilio} onChange={(e) => setCampo('domicilio', e.target.value)} />
            </label>
          </div>
        </fieldset>

        {/* Fechas */}
        <fieldset className="registro-bloque">
          <legend>Fechas</legend>
          <div className="registro-grid">
            <label>Fecha de nacimiento
              <input type="date" value={form.fechaNacimiento} onChange={(e) => setCampo('fechaNacimiento', e.target.value)} />
            </label>
            <label>Fecha de ingreso
              <input type="date" value={form.fechaIngreso} onChange={(e) => setCampo('fechaIngreso', e.target.value)} />
            </label>           
            <div className="registro-estado-campo">
              <span>Estado:</span>
              <span className={form.activo ? 'estado-activo' : 'estado-inactivo'}>
                {form.activo ? 'ACTIVO' : 'INACTIVO'}
              </span>
            </div>
          </div>
          <p className="registro-nota">La fecha de registro se guarda automática con la fecha de hoy.</p>
        </fieldset>

        {/* Asignación familiar */}
        <fieldset className="registro-bloque">
          <legend>Asignación familiar</legend>
          <div className="registro-grid">
            <label className="registro-check">
              <input type="checkbox" checked={form.hijos} onChange={(e) => setCampo('hijos', e.target.checked)} />
              ¿Tiene hijos?
            </label>
            <div className="registro-af">
              Asignación familiar:
              <span className={form.hijos ? 'af-con' : 'af-sin'}>{asignacionFamiliar}</span>
            </div>
          </div>
        </fieldset>

        {/* Documentos entregados */}
        <fieldset className="registro-bloque">
          <legend>Documentos entregados</legend>
          {!editarId ? (
            <p className="registro-nota">Guarda primero a la persona; luego, al editarla, podrás adjuntar sus documentos.</p>
          ) : (
            <table className="tabla">
              <thead><tr><th>✔</th><th>Documento</th><th>Acciones</th></tr></thead>
              <tbody>
                {TIPOS_DOC.map(({ tipo, label }) => {
                  const doc = documentos.find((d) => d.tipo === tipo);
                  return (
                    <tr key={tipo}>
                      <td><input type="checkbox" checked={!!doc} readOnly /></td>
                      <td>{label} {doc && <span className="doc-si">✔ {doc.nombreOriginal}</span>}</td>
                      <td className="registro-acciones">
                        <BotonSubir tipo={tipo} label={doc ? 'Reemplazar' : 'Adjuntar'} onSubir={subirDoc} />
                        {doc && <button type="button" className="btn-editar" onClick={() => verDoc(doc.id)}>Ver</button>}
                        {doc && <button type="button" className="btn-eliminar" onClick={() => eliminarDoc(doc.id)}>Eliminar</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </fieldset>

        {/* Observación */}
        <fieldset className="registro-bloque">
          <legend>Observación</legend>
          <textarea className="registro-textarea" rows={3} value={form.observacion}
            onChange={(e) => setCampo('observacion', e.target.value)} />
        </fieldset>

        {error && <p className="registro-error">{error}</p>}
        {mensaje && <p className="registro-ok">{mensaje}</p>}

        <div className="registro-botones">
          <button className="registro-boton" onClick={guardar} disabled={guardando}>
            {guardando ? 'Guardando...' : (editarId ? 'Actualizar' : 'Registrar')}
          </button>
          {editarId && (
            <button className="registro-cancelar" onClick={cancelarEdicion} disabled={guardando}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* ===== Buscador + tabla ===== */}
      <h2 className="registro-subtitulo">Personal registrado</h2>

      <div className="registro-filtros">
        <input
          className="registro-buscador"
          type="text"
          placeholder="Buscar por DNI, nombre, apellido, área o cargo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        
        <select
          className="registro-filtro-tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {tipos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>

        <div className="registro-filtro-fechas">
          <select value={campoFecha} onChange={(e) => setCampoFecha(e.target.value)}>
            <option value="">Filtrar por fecha…</option>
            <option value="fechaRegistro">Fecha de registro</option>
            <option value="fechaIngreso">Fecha de ingreso</option>
            <option value="fechaCese">Fecha de cese</option>
          </select>
          <label>Desde <input type="date" value={fDesde} onChange={(e) => setFDesde(e.target.value)} disabled={!campoFecha} /></label>
          <label>Hasta <input type="date" value={fHasta} onChange={(e) => setFHasta(e.target.value)} disabled={!campoFecha} /></label>
        </div>
      </div>

      <div className="registro-tabla-wrap">
        <TablaPersonal
          personal={filtradas}
          onEditar={editar}
          onEliminar={eliminar}
          onCesar={(p) => abrirModal('cesar', p)}
          onReingresar={(p) => abrirModal('reingresar', p)}
          onHistorial={(p) => abrirModal('historial', p)}          
        />
      </div>

      {modalModo && modalPersona && (
        <PersonalModal
          modo={modalModo}
          persona={modalPersona}
          historial={historial}
          fecha={modalFecha}
          setFecha={setModalFecha}
          motivo={modalMotivo}
          setMotivo={setModalMotivo}
          onConfirmar={confirmarAccion}
          onCerrar={cerrarModal}
        />
      )}
    </div>
  );
}

export default RegistroPersonal;