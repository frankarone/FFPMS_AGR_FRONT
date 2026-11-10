import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface Props {
  titulo: string;
  presentes: number;
  ausentes: number;
  porcentaje: number;
  pendientes: number;
}

function GraficoAsistenciaDia({ titulo, presentes, ausentes, pendientes, porcentaje }: Props) {
  const filas = [
    { nombre: 'Presentes', valor: presentes, color: '#43a047' },
    { nombre: 'Ausentes', valor: ausentes, color: '#e53935' },
    { nombre: 'Sin marcar', valor: pendientes, color: '#9e9e9e' },
  ].filter((f) => f.valor > 0);
  return (
    <div className="asis-grafico">
      <h3>{titulo}</h3>
      {presentes + ausentes + pendientes === 0 ? (
        <p className="asis-vacio">Sin registros</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={filas} dataKey="valor" nameKey="nombre" innerRadius={55} outerRadius={90} label>
                {filas.map((f) => (
                  <Cell key={f.nombre} fill={f.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="asis-porcentaje-centro">{porcentaje}% asistencia</p>
        </>
      )}
    </div>
  );
}

export default GraficoAsistenciaDia;