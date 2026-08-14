import { useEffect, useState } from 'react';
import { listarAuditoria } from '../../services/auditoriaService';
import type { Registro } from '../../types/auditoria';
import './Auditoria.css';

function Auditoria() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listarAuditoria()
      .then((datos) => {
        if (Array.isArray(datos)) setRegistros(datos);
        else setError('No se pudo cargar la auditoría');
      })
      .catch(() => setError('Error al conectar'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="auditoria">
      <h1 className="auditoria-titulo">AUDITORÍA</h1>

      {cargando && <p>Cargando...</p>}
      {error && <p className="auditoria-error">{error}</p>}

      {!cargando && !error && (
        <div className="tabla-scroll">
          <table className="tabla-auditoria">
            <thead>
              <tr>
                <th>Fecha</th><th>Usuario</th><th>Acción</th>
                <th>Método</th><th>Ruta</th><th>IP</th><th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.Id}>
                  <td>{new Date(r.Fecha).toLocaleString()}</td>
                  <td>{r.Usuario}</td>
                  <td>{r.Accion}</td>
                  <td>{r.Metodo}</td>
                  <td>{r.Ruta}</td>
                  <td>{r.Ip}</td>
                  <td>{r.Estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Auditoria;