import type { ReactNode } from 'react';

interface Props {
  titulo: string;
  valor: string | number;
  icono: ReactNode;
  color: string;
}

function TarjetaResumen({ titulo, valor, icono, color }: Props) {
  return (
    <div className="asis-tarjeta" style={{ borderColor: color }}>
      <span className="asis-tarjeta-icono" style={{ color }}>{icono}</span>
      <div className="asis-tarjeta-texto">
        <span className="asis-tarjeta-valor" style={{ color }}>{valor}</span>
        <span className="asis-tarjeta-titulo">{titulo}</span>
      </div>
    </div>
  );
}

export default TarjetaResumen;