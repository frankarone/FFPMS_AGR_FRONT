import { useMaestro } from '../../hooks/useMaestro';
import './MaestroAbm.css';

interface Props {
  titulo: string;
  base: string;        // ej. '/api/cargos'
  etiqueta?: string;   // ej. 'cargo'
}

function MaestroAbm({ titulo, base, etiqueta = 'registro' }: Props) {
  const { filtrados, nombre, setNombre, editarId, editar, cancelar, guardar, eliminar, busqueda, setBusqueda, mensaje, error } = useMaestro(base);

  return (
    <div className="maestro-contenedor">
      <h1 className="maestro-titulo">{titulo}</h1>

      <div className="maestro-form">
        <input
          type="text"
          placeholder={`Nombre del ${etiqueta}...`}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && guardar()}
        />
        <button className="btn-guardar" onClick={guardar}>{editarId ? 'Actualizar' : 'Agregar'}</button>
        {editarId && <button className="btn-cancelar" onClick={cancelar}>Cancelar</button>}
      </div>

      {error && <p className="maestro-error">{error}</p>}
      {mensaje && <p className="maestro-ok">{mensaje}</p>}

      <input className="maestro-buscador" type="text" placeholder="Buscar..."
        value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      <table className="tabla">
        <thead><tr><th>Nº</th><th>Nombre</th><th>Acciones</th></tr></thead>
        <tbody>
          {filtrados.map((m, i) => (
            <tr key={m.id}>
              <td>{i + 1}</td>
              <td>{m.nombre}</td>
              <td className="maestro-acciones">
                <button className="btn-editar" onClick={() => editar(m)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminar(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaestroAbm;