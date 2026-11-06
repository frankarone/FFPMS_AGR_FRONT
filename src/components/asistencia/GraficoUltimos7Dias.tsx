import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { AsistenciaDia } from '../../types/asistencia';
import { formatearFecha } from '../../utils/fecha';

interface Props {
  titulo: string;
  datos: AsistenciaDia[];
}

function GraficoUltimos7Dias({ titulo, datos }: Props) {
  const filas = datos.map((d) => ({ ...d, dia: formatearFecha(d.fecha).slice(0, 5) })); // dd/mm
  return (
    <div className="asis-grafico">
      <h3>{titulo}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={filas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dia" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="presentes" name="Presentes" stackId="a" fill="#43a047" />
          <Bar dataKey="ausentes" name="Ausentes" stackId="a" fill="#e53935" />
        </BarChart>
      </ResponsiveContainer>

      <table className="asis-tabla-dias">
        <thead>
          <tr><th>Día</th><th>Presentes</th><th>Ausentes</th><th>%</th></tr>
        </thead>
        <tbody>
          {filas.map((d) => (
            <tr key={d.fecha}>
              <td>{d.dia}</td>
              <td>{d.presentes}</td>
              <td className={d.ausentes > 0 ? 'asis-hay-ausentes' : ''}>{d.ausentes}</td>
              <td>{d.presentes + d.ausentes ? `${d.porcentaje}%` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GraficoUltimos7Dias;