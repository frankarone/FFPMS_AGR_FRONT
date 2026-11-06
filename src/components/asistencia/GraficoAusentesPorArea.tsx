import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { AsistenciaPorGrupo } from '../../types/asistencia';

const COLORES = ['#29b6f6', '#fbc02d', '#26a69a', '#ef6c00', '#1565c0', '#7cb342', '#8e24aa'];

interface Props {
  titulo: string;
  datos: AsistenciaPorGrupo[];
}

function GraficoAusentesPorArea({ titulo, datos }: Props) {
  const conAusentes = datos.filter((a) => a.ausentes > 0);
  return (
    <div className="asis-grafico">
      <h3>{titulo}</h3>
      {conAusentes.length === 0 ? (
        <p className="asis-vacio">Sin ausentes</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={conAusentes} dataKey="ausentes" nameKey="nombre" innerRadius={55} outerRadius={90} label>
              {conAusentes.map((a, i) => (
                <Cell key={a.id} fill={COLORES[i % COLORES.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default GraficoAusentesPorArea;