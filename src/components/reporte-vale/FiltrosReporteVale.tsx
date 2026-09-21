interface Props {
  busqueda: string;
  onBusqueda: (v: string) => void;
  desde: string;
  onDesde: (v: string) => void;
  hasta: string;
  onHasta: (v: string) => void;
  onFiltrar: () => void;
}

function FiltrosReporteVale({ busqueda, onBusqueda, desde, onDesde, hasta, onHasta, onFiltrar }: Props) {
  return (
    <div className="reporte-controles">
      <input type="text" placeholder="Buscar por N° vale o solicitante..."
        value={busqueda} onChange={(e) => onBusqueda(e.target.value)} />
      <label>Desde: <input type="date" value={desde} onChange={(e) => onDesde(e.target.value)} /></label>
      <label>Hasta: <input type="date" value={hasta} onChange={(e) => onHasta(e.target.value)} /></label>
      <button onClick={onFiltrar}>Filtrar</button>
    </div>
  );
}

export default FiltrosReporteVale;