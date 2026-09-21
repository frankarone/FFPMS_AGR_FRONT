import { useReporteVale } from '../../hooks/useReporteVale';
import FiltrosReporteVale from '../../components/reporte-vale/FiltrosReporteVale';
import TablaReporteVale from '../../components/reporte-vale/TablaReporteVale';
import './ReporteVale.css';

function ReporteVale() {
  const {
    filtradas, cargando, descargando,
    busqueda, setBusqueda,
    desde, setDesde,
    hasta, setHasta,
    buscar, descargar,
  } = useReporteVale();

  return (
    <div className="reporte-vale-contenedor">
      <h1 className="reporte-titulo">REPORTE VALE DE CONSUMO</h1>
      <FiltrosReporteVale
        busqueda={busqueda} onBusqueda={setBusqueda}
        desde={desde} onDesde={setDesde}
        hasta={hasta} onHasta={setHasta}
        onFiltrar={buscar}
      />
      {cargando ? <p>Cargando...</p> : (
        <TablaReporteVale vales={filtradas} descargando={descargando} onDescargar={descargar} />
      )}
    </div>
  );
}

export default ReporteVale;