import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Inicio from '../pages/inicio/Inicio';
import GenerarQR from '../pages/qr/GenerarQR';
import RegistroPersonal from '../pages/registro/RegistroPersonal';
import Auditoria from '../pages/auditoria/Auditoria';
import EstadoOrden from '../pages/estado-orden/EstadoOrden';
import ReporteOrden from '../pages/reporte-orden/ReporteOrden';
import ReporteVale from '../pages/reporte-vale/ReporteVale';
import ProductosPedidos from '../pages/productos-pedidos/ProductosPedidos';
import CargosPage from '../pages/mantenimiento/CargosPage';
import AreasPage from '../pages/mantenimiento/AreasPage';
import TiposPersonalPage from '../pages/mantenimiento/TiposPersonalPage';
import NacionalidadesPage from '../pages/mantenimiento/NacionalidadesPage';
import GradosInstruccionPage from '../pages/mantenimiento/GradosInstruccionPage';
import ReportePersonal from '../pages/reporte-personal/ReportePersonal';
import BancosPage from '../pages/mantenimiento/BancosPage';
import ImportarPersonal from '../pages/importar-personal/ImportarPersonal';
import type { Usuario } from '../types/auth';

interface Props {
  usuario: Usuario;
  onLogout: () => void;
}

function AppRoutes({ usuario, onLogout }: Props) {
  return (
    <Routes>
      <Route element={<MainLayout usuario={usuario} onLogout={onLogout} />}>
        <Route path="/" element={<Inicio usuario={usuario} />} />
        <Route path="/qr" element={<GenerarQR />} />
        <Route path="/registro" element={<RegistroPersonal />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/estado-orden" element={<EstadoOrden />} />
        <Route path="/reporte-orden" element={<ReporteOrden />} />
        <Route path="/reporte-vale" element={<ReporteVale />} />
        <Route path="/productos-pedidos" element={<ProductosPedidos />} />
        <Route path="/cargos" element={<CargosPage />} />
        <Route path="/areas" element={<AreasPage />} />
        <Route path="/tipos-personal" element={<TiposPersonalPage />} />
        <Route path="/nacionalidades" element={<NacionalidadesPage />} />
        <Route path="/grados-instruccion" element={<GradosInstruccionPage />} />
        <Route path="/reporte-personal" element={<ReportePersonal />} />
        <Route path="/bancos" element={<BancosPage />} />
        <Route path="/importar-personal" element={<ImportarPersonal />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;