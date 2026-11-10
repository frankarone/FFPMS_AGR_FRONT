import type { ItemPlantilla } from '../../types/asistencia';

interface Props {
  area: string;
  items: ItemPlantilla[];
  guardada: boolean;
  estimado: number | null;
  onGuardar: () => void;
  onEditar: () => void;
  onQuitar: (item: ItemPlantilla) => void;
  onCambiarEstimado: (total: number) => Promise<boolean>;
}

function TarjetaAreaPlantilla({ area, items, guardada, estimado, onGuardar, onEditar, onQuitar, onCambiarEstimado }: Props) {
  const lleno = estimado !== null && items.length >= estimado;

  return (
    <div className={`plan-tarjeta ${guardada ? 'plan-tarjeta-guardada' : ''}`}>
      <div className="plan-tarjeta-cabecera">
        <span className="plan-tarjeta-area">{area}</span>
        {guardada ? (
          <button className="plan-btn-editar" onClick={onEditar}>EDITAR</button>
        ) : (
          <button className="plan-btn-guardar" onClick={onGuardar}>GUARDAR</button>
        )}
      </div>

      <div className="plan-estimado">
        <label>
          TOTAL ESTIMADO
          <input
            key={estimado ?? 'vacio'}
            type="number"
            min={1}
            defaultValue={estimado ?? ''}
            disabled={guardada}
            className={estimado === null ? 'plan-estimado-falta' : ''}
            title="Máximo de personas en esta área"
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            onBlur={async (e) => {
              const input = e.currentTarget;
              if (input.value === '' || Number(input.value) === estimado) return;
              const ok = await onCambiarEstimado(Number(input.value));
              if (!ok) input.value = estimado === null ? '' : String(estimado);
            }}
          />
        </label>
        <span className={`plan-tarjeta-total ${lleno ? 'plan-total-lleno' : ''}`}>
          TOTAL <b>{items.length}{estimado !== null ? ` / ${estimado}` : ''}</b>
        </span>
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