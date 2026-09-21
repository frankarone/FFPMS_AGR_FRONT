import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import type { Usuario } from '../types/auth';

interface Props {
  usuario: Usuario;
  onLogout: () => void;
}

function MainLayout({ usuario, onLogout }: Props) {
  return (
    <>
      <Navbar usuario={usuario} onLogout={onLogout} />
      <Outlet />   {/* aquí se dibuja cada página */}
    </>
  );
}

export default MainLayout;