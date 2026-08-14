import { Link } from 'react-router-dom';
import { FaChartBar, FaQrcode, FaUsers, FaFileInvoiceDollar, FaClipboardList, FaFilePdf, FaClipboardCheck } from 'react-icons/fa';
import type { Usuario } from '../../types/auth';
import './Inicio.css';

interface Props {
  usuario: Usuario;   
}

const modulos = [
  {
    nombre: 'PALLET - QR',
    ruta: '/qr',
    clase: 'modulo-verde',
    icono: <FaQrcode className="modulo-icono" />,
    roles: ['Admin', 'Sistema', 'Paletizado', 'Etiquetas'],
  },
  {
    nombre: 'REGISTRO PERSONAL',
    ruta: '/registro',
    clase: 'modulo-azul',
    icono: <FaUsers className="modulo-icono" />,
    roles: ['Admin', 'Sistema', 'Recursos Humanos','Contabilidad'],
  },
  {
    nombre: 'ESTADO DE ORDEN',
    ruta: '/estado-orden',
    clase: 'modulo-azul',
    icono: <FaFileInvoiceDollar className="modulo-icono" />,
    roles: ['Admin', 'Sistema', 'Gerencia', 'Planeamiento','Contabilidad'], 
  },
  {
  nombre: 'AUDITORÍA',
  ruta: '/auditoria',
  clase: 'modulo-morado',
  icono: <FaClipboardList className="modulo-icono" />,
  roles: ['Admin', 'Sistema', 'AUDITORIA'],
  },
  {
  nombre: 'REPORTE ORDEN DE COMPRA',
  ruta: '/reporte-orden',
  clase: 'modulo-rojo',
  icono: <FaFilePdf className="modulo-icono" />,
  roles: ['Admin', 'Sistema', 'Gerencia', 'Contabilidad'],
},
{
  nombre: 'REPORTE VALE CONSUMO',
  ruta: '/reporte-vale',
  clase: 'modulo-naranja',
  icono: <FaClipboardCheck className="modulo-icono" />,
  roles: ['Admin', 'Sistema', 'Almacen','Gerencia', 'Contabilidad'],
},
{
  nombre: 'PRODUCTOS MÁS PEDIDOS',
  ruta: '/productos-pedidos',
  clase: 'modulo-teal',
  icono: <FaChartBar className="modulo-icono" />,
  roles: ['Admin', 'Sistema', 'Gerencia', 'Contabilidad'],
},
];

function Inicio({ usuario }: Props) {
  const rolesUsuario = usuario.roles || [];
  // Admin y Sistema TODO
  const esAdmin = rolesUsuario.includes('Admin') || rolesUsuario.includes('Sistema');

  const visibles = modulos.filter(
    (m) => esAdmin || m.roles.some((r) => rolesUsuario.includes(r))
  );

  return (
    <div className="inicio">
      {visibles.map((m) => (
        <Link key={m.ruta} to={m.ruta} className={`modulo ${m.clase}`}>
          <span className="modulo-titulo">{m.nombre}</span>
          <div className="modulo-icono-caja">{m.icono}</div>
        </Link>
      ))}
    </div>
  );
}

export default Inicio;