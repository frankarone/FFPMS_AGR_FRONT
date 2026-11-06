import { Link } from 'react-router-dom';

// Los 3 botones superiores del módulo de asistencia
function MenuAsistencia() {
  return (
    <div className="asis-botones">
      <Link to="/asistencia/plantilla" className="asis-boton asis-boton-plantilla">PLANTILLA</Link>
      <Link to="/asistencia/marcar" className="asis-boton asis-boton-marcar">ASISTENCIA AGR</Link>
      <Link to="/asistencia/ver" className="asis-boton asis-boton-ver">VER ASISTENCIA</Link>
    </div>
  );
}

export default MenuAsistencia;