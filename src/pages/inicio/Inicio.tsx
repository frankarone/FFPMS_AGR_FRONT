import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { FaChartBar, FaQrcode, FaUsers, FaFileInvoiceDollar, FaClipboardList, FaFilePdf, FaClipboardCheck,
         FaBriefcase, FaBuilding, FaUserTag, FaFlag, FaGraduationCap , FaUniversity } from 'react-icons/fa';
import type { Usuario } from '../../types/auth';
import './Inicio.css';

interface Props {
  usuario: Usuario;
}

interface Modulo {
  nombre: string;
  ruta: string;
  grupo: string;        
  icono: ReactNode;
  roles: string[];
}

const modulos: Modulo[] = [
  // --- OPERACIONES ---
  { nombre: 'PALLET - QR',        ruta: '/qr',            grupo: 'operaciones', icono: <FaQrcode className="modulo-icono" />,            roles: ['Admin', 'Sistema', 'Paletizado', 'Etiquetas'] },
  { nombre: 'ESTADO DE ORDEN',    ruta: '/estado-orden',  grupo: 'operaciones', icono: <FaFileInvoiceDollar className="modulo-icono" />, roles: ['Admin', 'Sistema', 'Gerencia', 'Planeamiento', 'Contabilidad'] },
  { nombre: 'REGISTRO PERSONAL',  ruta: '/registro',      grupo: 'operaciones', icono: <FaUsers className="modulo-icono" />,             roles: ['Admin', 'Sistema', 'Recursos Humanos', 'Contabilidad'] },

  // --- REPORTES ---
  { nombre: 'REPORTE ORDEN DE COMPRA', ruta: '/reporte-orden',      grupo: 'reportes', icono: <FaFilePdf className="modulo-icono" />,        roles: ['Admin', 'Sistema', 'Gerencia', 'Contabilidad'] },
  { nombre: 'REPORTE VALE CONSUMO',    ruta: '/reporte-vale',       grupo: 'reportes', icono: <FaClipboardCheck className="modulo-icono" />, roles: ['Admin', 'Sistema', 'Almacen', 'Gerencia', 'Contabilidad'] },
  { nombre: 'PRODUCTOS MÁS PEDIDOS',   ruta: '/productos-pedidos',  grupo: 'reportes', icono: <FaChartBar className="modulo-icono" />,       roles: ['Admin', 'Sistema', 'Gerencia', 'Contabilidad'] },
  { nombre: 'REPORTE PERSONAL', ruta: '/reporte-personal', grupo: 'reportes', icono: <FaUsers className="modulo-icono" />, roles: ['Admin', 'Sistema', 'Recursos Humanos', 'Gerencia'] },

  // --- AUDITORÍA ---
  { nombre: 'AUDITORÍA', ruta: '/auditoria', grupo: 'auditoria', icono: <FaClipboardList className="modulo-icono" />, roles: ['Admin', 'Sistema', 'AUDITORIA'] },
  
  // --- RELACIONES / REGISTRO PERSONAL ---
  { nombre: 'CARGOS',              ruta: '/cargos',             grupo: 'mantenimiento', icono: <FaBriefcase className="modulo-icono" />,     roles: ['Admin', 'Sistema', 'Recursos Humanos'] },
  { nombre: 'ÁREAS',               ruta: '/areas',              grupo: 'mantenimiento', icono: <FaBuilding className="modulo-icono" />,      roles: ['Admin', 'Sistema', 'Recursos Humanos'] },
  { nombre: 'TIPO DE PERSONAL',    ruta: '/tipos-personal',     grupo: 'mantenimiento', icono: <FaUserTag className="modulo-icono" />,       roles: ['Admin', 'Sistema', 'Recursos Humanos'] },
  { nombre: 'NACIONALIDADES',      ruta: '/nacionalidades',     grupo: 'mantenimiento', icono: <FaFlag className="modulo-icono" />,          roles: ['Admin', 'Sistema', 'Recursos Humanos'] },
  { nombre: 'GRADO INSTRUCCIÓN',   ruta: '/grados-instruccion', grupo: 'mantenimiento', icono: <FaGraduationCap className="modulo-icono" />, roles: ['Admin', 'Sistema', 'Recursos Humanos'] },
  { nombre: 'BANCOS', ruta: '/bancos', grupo: 'mantenimiento', icono: <FaUniversity className="modulo-icono" />, roles: ['Admin', 'Sistema', 'Recursos Humanos'] },
];

const grupos = [
  { id: 'operaciones', titulo: 'OPERACIONES' },
  { id: 'reportes',    titulo: 'REPORTES' },
  { id: 'auditoria',   titulo: 'AUDITORÍA' },
  { id: 'mantenimiento', titulo: 'RELACIONES · REGISTRO PERSONAL' },
];

function Inicio({ usuario }: Props) {
  const rolesUsuario = usuario.roles || [];
  const esAdmin = rolesUsuario.includes('Admin') || rolesUsuario.includes('Sistema');

  const puedeVer = (m: Modulo) => esAdmin || m.roles.some((r) => rolesUsuario.includes(r));

  return (
    <div className="inicio">
      {grupos.map((g) => {
        const visibles = modulos.filter((m) => m.grupo === g.id && puedeVer(m));
        if (visibles.length === 0) return null; 
        return (
          <section key={g.id} className={`bloque bloque-${g.id}`}>
            <h2 className="bloque-titulo">{g.titulo}</h2>
            <div className="bloque-modulos">
              {visibles.map((m) => (
                <Link key={m.ruta} to={m.ruta} className="modulo">
                  <span className="modulo-titulo">{m.nombre}</span>
                  <div className="modulo-icono-caja">{m.icono}</div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default Inicio;