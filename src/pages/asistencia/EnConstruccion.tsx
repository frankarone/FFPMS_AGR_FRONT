import { Link } from 'react-router-dom';
import './AsistenciaInicio.css';

interface Props {
  titulo: string;
}

function EnConstruccion({ titulo }: Props) {
  return (
    <div className="asis-inicio">
      <h1 className="asis-titulo">{titulo}</h1>
      <p className="asis-vacio">Pantalla en construcción.</p>
      <p className="asis-vacio"><Link to="/asistencia">← Volver a Asistencia</Link></p>
    </div>
  );
}

export default EnConstruccion;