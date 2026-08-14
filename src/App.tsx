import { useState , useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Inicio from './modulos/inicio/Inicio';
import GenerarQR from './modulos/qr/GenerarQR';
import RegistroPersonal from './modulos/registro/RegistroPersonal';
import Login from './modulos/login/Login';
import Auditoria from './modulos/auditoria/Auditoria';
import EstadoOrden from './modulos/estado-orden/EstadoOrden';
import ReporteOrden from './modulos/reporte-orden/ReporteOrden';
import ReporteVale from './modulos/reporte-vale/ReporteVale';
import ProductosPedidos from './modulos/productos-pedidos/ProductosPedidos';
import './App.css';

const MINUTOS = 10;
const LIMITE = MINUTOS * 60 * 1000;

function App() {
  const [usuario, setUsuario] = useState(()=> {
    const g = localStorage.getItem('usuario');
    if (!g) return null;

    const ultima = Number(localStorage.getItem('ultimaActividad') || 0);

    if (ultima && Date.now() - ultima > LIMITE){
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      return null;
    }
    return JSON.parse(g);
  });

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('ultimaActividad');
    setUsuario(null);
    window.location.hash= '#/'; //vuelve login
  };

  const alIniciar = (u: any) => {
    localStorage.setItem('ultimaActividad', String(Date.now()));
    window.location.hash= '#/';
    setUsuario(u);
  };

  useEffect(() => {
    if(!usuario) return;

    let timer:number;
    const reiniciar = () =>{
      localStorage.setItem('ultimaActividad',String(Date.now()));
      clearTimeout(timer);
      timer = window.setTimeout(cerrarSesion, LIMITE);
    };

    const eventos = ['mousemove' , 'keydown', 'click', 'scroll' , 'touchstart'];
    eventos.forEach((e) => window.addEventListener(e,reiniciar));
    reiniciar();

    return () => {
      clearTimeout(timer);
      eventos.forEach((e) => window.removeEventListener(e,reiniciar));
    };
  }, [usuario]);


  //Sin sesión → mostrar Login
  if(!usuario){
    return<Login onLogin={alIniciar} />;
  }

  return (
    <HashRouter>
      <Navbar usuario={usuario} onLogout={cerrarSesion} />
      <Routes>
        <Route path="/" element={<Inicio usuario={usuario} />} />
        <Route path="/qr" element={<GenerarQR />} />
        <Route path="/registro" element={<RegistroPersonal />} />
        <Route path="/auditoria" element={<Auditoria />} />
        <Route path="/estado-orden" element={<EstadoOrden />} />
        <Route path="/reporte-orden" element={<ReporteOrden />} />
        <Route path="/reporte-vale" element={<ReporteVale />} />
        <Route path="/productos-pedidos" element={<ProductosPedidos />} />
      </Routes>
    </HashRouter>
  );
}

export default App;