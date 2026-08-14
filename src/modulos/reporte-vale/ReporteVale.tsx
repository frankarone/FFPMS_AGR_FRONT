import { useState } from 'react';
import { listarVales, descargarValePdf } from '../../services/valeService';
import type { Vale } from '../../types/vale';
import './ReporteVale.css';

function ReporteVale() {
  const [vales, setVales] = useState<Vale[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(false);  
  const [descargando, setDescargando] = useState('');

  const buscar = () => {
    setCargando(true);                    
    listarVales(desde, hasta)
      .then((datos) => { if (Array.isArray(datos)) setVales(datos); })
      .finally(() => setCargando(false));
  };

  const descargar = async (numero: string) => {
    setDescargando(numero);
    await descargarValePdf(numero);
    setDescargando('');
  };

  const filtradas = vales.filter((v) => {
    const t = busqueda.toLowerCase();
    return (v.numero || '').toLowerCase().includes(t) || (v.solicitadoPor || '').toLowerCase().includes(t);
  });

  return (
    <div className="reporte-vale-contenedor">
      <h1 className="reporte-titulo">REPORTE VALE DE CONSUMO</h1>

      <div className="reporte-controles">
        <input type="text" placeholder="Buscar por N° vale o solicitante..."
          value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        <label>Desde: <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
        <label>Hasta: <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
        <button onClick={buscar}>Filtrar</button>
      </div>

      {cargando ? (  <p>Cargando...</p>) : (            
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr><th>N° Vale</th><th>Fecha</th><th>Solicitado por</th><th>Entregado por</th><th>Reporte</th></tr>
            </thead>
            <tbody>
              {filtradas.map((v) => (
                <tr key={v.numero}>
                  <td>{v.numero}</td>
                  <td>{v.fechaSolicitado ? new Date(v.fechaSolicitado).toLocaleDateString() : ''}</td>
                  <td>{v.solicitadoPor}</td>
                  <td>{v.entregadoPor}</td>
                  <td>
                    <button className="btn-pdf" disabled={descargando === v.numero}
                      onClick={() => descargar(v.numero)}>
                      {descargando === v.numero ? 'Generando...' : 'PDF'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReporteVale;