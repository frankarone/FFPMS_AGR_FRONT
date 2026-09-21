interface Props {
  busqueda: string;
  onBusqueda: (v: string) => void;
  filtro: string;
  onFiltro: (v: string) => void;
  desde: string;
  onDesde: (v: string) => void;
  hasta: string;
  onHasta: (v: string) => void;
  onFiltrar: () => void;
}

function FiltrosOrden({ busqueda, onBusqueda, filtro, onFiltro, desde, onDesde, hasta, onHasta, onFiltrar }: Props) {
  return (
    <div className="orden-controles">
      <input
        type="text"
        placeholder="Buscar por N° orden o proveedor..."
        value={busqueda}
        onChange={(e) => onBusqueda(e.target.value)}
      />
      <select value={filtro} onChange={(e) => onFiltro(e.target.value)}>
        <option value="TODOS">Todas</option>
        <option value="CON">Con factura</option>
        <option value="SIN">Sin factura</option>
      </select>
      <label className="fecha">Desde:
        <input type="date" value={desde} onChange={(e) => onDesde(e.target.value)} />
      </label>
      <label className="fecha">Hasta:
        <input type="date" value={hasta} onChange={(e) => onHasta(e.target.value)} />
      </label>
      <button onClick={onFiltrar}>Filtrar</button>
    </div>
  );
}

export default FiltrosOrden;