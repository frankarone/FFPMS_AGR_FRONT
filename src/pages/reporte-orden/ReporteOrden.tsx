import { useReporteOrden } from '../../hooks/useReporteOrden';
import FiltrosReporteOrden from '../../components/reporte-orden/FiltrosReporteOrden';
import TablaReporteOrden from '../../components/reporte-orden/TablaReporteOrden';
import './ReporteOrden.css';

function ReporteOrden() {
  const {
    filtradas, cargando, descargando,
    busqueda, setBusqueda,
    desde, setDesde,
    hasta, setHasta,
    buscar, descargar,
  } = useReporteOrden();

  return (
    <div className="reporte-contenedor">
      <h1 className="reporte-titulo">REPORTE ORDEN DE COMPRA</h1>
      <FiltrosReporteOrden
        busqueda={busqueda} onBusqueda={setBusqueda}
        desde={desde} onDesde={setDesde}
        hasta={hasta} onHasta={setHasta}
        onFiltrar={buscar}
      />
      {cargando ? <p>Cargando...</p> : (
        <TablaReporteOrden ordenes={filtradas} descargando={descargando} onDescargar={descargar} />
      )}
    </div>
  );
}

export default ReporteOrden;