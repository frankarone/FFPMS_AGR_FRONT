import { useRef, useState } from 'react';
import { descargarPlantilla, importarPersonal } from '../../services/importPersonalService';
import type { ResultadoImport } from '../../types/personal';
import './ImportarPersonal.css';

function ImportarPersonal() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [resultado, setResultado] = useState<ResultadoImport | null>(null);
  const [cargando, setCargando] = useState(false);
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');

  const bajarPlantilla = async () => {
    setDescargando(true);
    await descargarPlantilla();
    setDescargando(false);
  };

  const importar = async () => {
    if (!archivo) { setError('Selecciona un archivo Excel primero'); return; }
    setError(''); setResultado(null); setCargando(true);
    try {
      const r = await importarPersonal(archivo);
      if (r) setResultado(r);
      else setError('No se pudo importar (¿sesión expirada?)');
    } catch {
      setError('Error al importar el archivo');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="import-contenedor">
      <h1 className="import-titulo">IMPORTAR REGISTRO DE PERSONAL</h1>

      <div className="import-pasos">
        <div className="import-paso">
          <span className="import-num">1</span>
          <div>
            <b>Descarga la plantilla</b>
            <p>Llénala con los datos. Usa la hoja "Valores válidos" para Cargo, Área, Banco, etc.</p>
            <button className="btn-plantilla" onClick={bajarPlantilla} disabled={descargando}>
              {descargando ? 'Descargando...' : 'Descargar plantilla'}
            </button>
          </div>
        </div>

        <div className="import-paso">
          <span className="import-num">2</span>
          <div>
            <b>Sube el Excel lleno</b>
            <p>Selecciona el archivo (.xlsx) y presiona Importar.</p>
            <div className="import-subir">
              <button className="btn-elegir" onClick={() => inputRef.current?.click()}>Elegir archivo</button>
              <span className="import-nombre">{archivo ? archivo.name : 'Ningún archivo seleccionado'}</span>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx"
                style={{ display: 'none' }}
                onChange={(e) => { setArchivo(e.target.files?.[0] ?? null); setResultado(null); }}
              />
              <button className="btn-importar" onClick={importar} disabled={cargando || !archivo}>
                {cargando ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && <p className="import-error">{error}</p>}

      {resultado && (
        <div className="import-resultado">
          <p className="import-ok">Registros insertados: <b>{resultado.insertados}</b></p>
          {resultado.errores.length > 0 ? (
            <>
              <p className="import-warn">Filas con problemas: {resultado.errores.length}</p>
              <table className="tabla">
                <thead><tr><th>Fila</th><th>Motivo</th></tr></thead>
                <tbody>
                  {resultado.errores.map((e, i) => (
                    <tr key={i}><td>{e.fila}</td><td>{e.motivo}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="import-nota">Corrige esas filas en el Excel y vuelve a importar solo esas (las ya insertadas no se duplican: el DNI repetido se salta).</p>
            </>
          ) : (
            <p className="import-ok">Sin errores.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ImportarPersonal;