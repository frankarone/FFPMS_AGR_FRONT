import type { ItemPlantilla } from '../../types/asistencia';

interface Props {
  area: string;
  items: ItemPlantilla[];
  guardada: boolean;
  onGuardar: () => void;
  onEditar: () => void;
  onQuitar: (item: ItemPlantilla) => void;
}

function TarjetaAreaPlantilla({ area, items, guardada, onGuardar, onEditar, onQuitar }: Props) {
  return (
    <div className={`plan-tarjeta ${guardada ? 'plan-tarjeta-guardada' : ''}`}>
      <div className="plan-tarjeta-cabecera">
        <span className="plan-tarjeta-area">{area}</span>
        <span className="plan-tarjeta-total">TOTAL <b>{items.length}</b></span>
        {guardada ? (
          <button className="plan-btn-editar" onClick={onEditar}>EDITAR</button>
        ) : (
          <button className="plan-btn-guardar" onClick={onGuardar}>GUARDAR</button>
        )}
      </div>

      <ul className="plan-lista">
        {items.map((i) => (
          <li key={i.personalId}>
            <span><small>{i.dni}</small>{i.apellidos} {i.nombres}</span>
            {!guardada && (
              <button className="plan-btn-quitar" title="Quitar de la plantilla" onClick={() => onQuitar(i)}>X</button>
            )}
          </li>
        ))}
      </ul>

      {guardada && <p className="plan-guardada-texto">✓ Área guardada</p>}
    </div>
  );
}

export default TarjetaAreaPlantilla;