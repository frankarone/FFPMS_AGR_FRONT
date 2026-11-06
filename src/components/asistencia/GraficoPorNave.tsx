import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { AsistenciaPorGrupo } from '../../types/asistencia';

interface Props {
  datos: AsistenciaPorGrupo[];
}

function GraficoPorNave({ datos }: Props) {
  return (
    <div className="asis-grafico">
      <h3>Asistencia por nave – hoy</h3>
      {datos.length === 0 ? (
        <p className="asis-vacio">Sin registros</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={datos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="presentes" name="Presentes" stackId="a" fill="#43a047" />
              <Bar dataKey="ausentes" name="Ausentes" stackId="a" fill="#e53935" />
            </BarChart>
          </ResponsiveContainer>
          <ul className="asis-porcentajes">
            {datos.map((n) => (
              <li key={n.id}><b>{n.nombre}</b>: {n.porcentaje}% asistencia</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default GraficoPorNave;