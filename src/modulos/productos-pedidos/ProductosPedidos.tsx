import { useState } from 'react';
import { listarProductosPedidos, descargarProductosExcel } from '../../services/reporteProductoService';
import type { ProductoPedido } from '../../types/producto';
import './ProductosPedidos.css';

function ProductosPedidos() {
  const [datos, setDatos] = useState<ProductoPedido[]>([]);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cargando, setCargando] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const buscar = () => {
    setCargando(true);
    setBuscado(true);
    listarProductosPedidos(desde, hasta)
      .then((d) => { if (Array.isArray(d)) setDatos(d); })
      .finally(() => setCargando(false));
  };

  return (
    <div className="reporte-productos-contenedor">
      <h1 className="reporte-titulo">PRODUCTOS MÁS PEDIDOS</h1>

      <div className="reporte-controles">
        <label>Desde: <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
        <label>Hasta: <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
        <button onClick={buscar}>Buscar</button>
        <button className="btn-excel" onClick={() => descargarProductosExcel(desde, hasta)}
          disabled={!buscado || datos.length === 0}>
          Exportar Excel
        </button>
      </div>

      {cargando ? <p>Cargando...</p> : (
        <div className="tabla-scroll">
          <table className="tabla">
            <thead>
              <tr>
                <th>#</th><th>Código</th><th>Producto</th><th>Unidad</th>
                <th>Solicitante</th><th>Destino</th>
                <th>Total Cant.</th><th>N° Órdenes</th><th>Monto Total</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{d.codigo}</td>
                  <td>{d.producto}</td>
                  <td>{d.unidad}</td>
                  <td>{d.solicitante}</td>   
                  <td>{d.destino}</td>          
                  <td>{d.totalCantidad}</td>
                  <td>{d.nroOrdenes}</td>
                  <td>{d.montoTotal?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductosPedidos;