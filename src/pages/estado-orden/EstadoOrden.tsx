import { useOrdenes } from '../../hooks/useOrdenes';
import FiltrosOrden from '../../components/estado-orden/FiltrosOrden';
import TablaOrdenes from '../../components/estado-orden/TablaOrdenes';
import DetalleOrden from '../../components/estado-orden/DetalleOrden';
import './EstadoOrden.css';

function EstadoOrden() {
  const {
    filtradas, detalle, cargando,
    busqueda, setBusqueda,
    filtro, setFiltro,
    desde, setDesde,
    hasta, setHasta,
    buscar, verDetalle, cerrarDetalle,
  } = useOrdenes();

  // Vista DETALLE
  if (detalle && detalle.orden) {
    return <DetalleOrden detalle={detalle} onVolver={cerrarDetalle} />;
  }

  // Vista LISTA
  return (
    <div className="orden-contenedor">
      <h1 className="orden-titulo">ESTADO DE ÓRDENES</h1>
      <FiltrosOrden
        busqueda={busqueda} onBusqueda={setBusqueda}
        filtro={filtro} onFiltro={setFiltro}
        desde={desde} onDesde={setDesde}
        hasta={hasta} onHasta={setHasta}
        onFiltrar={buscar}
      />
      {cargando ? <p>Cargando...</p> : (
        <TablaOrdenes ordenes={filtradas} onVerDetalle={verDetalle} />
      )}
    </div>
  );
}

export default EstadoOrden;