import type { PersonalListado } from '../../types/personal';
import { formatearFecha } from '../../utils/fecha';

interface Props {
  personal: PersonalListado[];
  onEditar: (p: PersonalListado) => void;
  onEliminar: (id: number) => void;
  onCesar: (p: PersonalListado) => void;
  onReingresar: (p: PersonalListado) => void;
  onHistorial: (p: PersonalListado) => void;
}

function TablaPersonal({ personal, onEditar, onEliminar, onCesar, onReingresar, onHistorial}: Props) {
  if (personal.length === 0) {
    return <p className="registro-vacio">No hay personal que coincida.</p>;
  }

  const siNo = (v: boolean) => <span className={v ? 'doc-si' : 'doc-no'}>{v ? 'Sí' : 'No'}</span>;

  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead>
          <tr>
            <th>Estado</th><th>DNI</th><th>Nombres</th><th>Apellidos</th><th>Sexo</th><th>Estado civil</th>
            <th>Cargo</th><th>Área</th><th>Tipo</th><th>Nacionalidad</th><th>Grado</th>
            <th>Correo</th><th>Celular</th><th>Domicilio</th><th>Sueldo</th><th>Seguro</th><th>Banco</th><th>N° Cuenta</th>
            <th>F. Nac.</th><th>F. Ingreso</th><th>F. Cese</th>
            <th>Hijos</th><th>Asig. Fam.</th>
            <th>CV</th><th>Copia DNI</th><th>Recibo</th><th>Ant. Pol.</th><th>Ident. Menor</th>
            <th>Observación</th><th>F. Registro</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {personal.map((p) => (
            <tr key={p.id}>
              <td><span className={p.activo ? 'estado-activo' : 'estado-inactivo'}>{p.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
              <td>{p.dni}</td>
              <td>{p.nombres}</td>
              <td>{p.apellidos}</td>
              <td>{p.sexo}</td>
              <td>{p.estadoCivil}</td>
              <td>{p.cargo}</td>
              <td>{p.area}</td>
              <td>{p.tipoPersonal || '-'}</td>
              <td>{p.nacionalidad || '-'}</td>
              <td>{p.gradoInstruccion || '-'}</td>
              <td>{p.correoElectronico || '-'}</td>
              <td>{p.celular || '-'}</td>
              <td>{p.domicilio || '-'}</td>
              <td>{p.sueldo != null ? Number(p.sueldo).toFixed(2) : '-'}</td>
              <td>{p.tieneSeguro ? (p.sistemaPension || 'Sí') : 'No'}</td>
              <td>{p.banco || '-'}</td>
              <td>{p.nroCuenta || '-'}</td>
              <td>{formatearFecha(p.fechaNacimiento)}</td>
              <td>{formatearFecha(p.fechaIngreso)}</td>
              <td>{formatearFecha(p.fechaCese)}</td>              
              <td>{p.hijos ? 'Sí' : 'No'}</td>
              <td><span className={p.asignacionFamiliar === 'DERECHO A.F.' ? 'af-con' : 'af-sin'}>{p.asignacionFamiliar}</span></td>
              <td>{siNo(p.cv)}</td>
              <td>{siNo(p.copiaDni)}</td>
              <td>{siNo(p.recibo)}</td>
              <td>{siNo(p.antecedentePolicial)}</td>
              <td>{siNo(p.identMenor)}</td>
              <td>{p.observacion || '-'}</td>
              <td>{formatearFecha(p.fechaRegistro)}</td>
              <td className="registro-acciones">
                <button className="btn-editar" onClick={() => onEditar(p)}>Editar</button>                
                <button className="btn-cesar" onClick={() => onCesar(p)}>Cesar</button>
                <button className="btn-reingresar" onClick={() => onReingresar(p)}>Reingresar</button>
                <button className="btn-historial" onClick={() => onHistorial(p)}>Historial</button>                
                <button className="btn-eliminar" onClick={() => onEliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPersonal;