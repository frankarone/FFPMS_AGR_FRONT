import { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Login from './pages/login/Login';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const MINUTOS = 10;
const LIMITE = MINUTOS * 60 * 1000;

function App() {
  const [usuario, setUsuario] = useState(() => {
    const g = localStorage.getItem('usuario');
    if (!g) return null;
    const ultima = Number(localStorage.getItem('ultimaActividad') || 0);
    if (ultima && Date.now() - ultima > LIMITE) {
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
    window.location.hash = '#/';
  };

  const alIniciar = (u: any) => {
    localStorage.setItem('ultimaActividad', String(Date.now()));
    window.location.hash = '#/';
    setUsuario(u);
  };

  useEffect(() => {
    if (!usuario) return;
    let timer: number;
    const reiniciar = () => {
      localStorage.setItem('ultimaActividad', String(Date.now()));
      clearTimeout(timer);
      timer = window.setTimeout(cerrarSesion, LIMITE);
    };
    const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    eventos.forEach((e) => window.addEventListener(e, reiniciar));
    reiniciar();
    return () => {
      clearTimeout(timer);
      eventos.forEach((e) => window.removeEventListener(e, reiniciar));
    };
  }, [usuario]);

  // Sin sesión → mostrar Login
  if (!usuario) {
    return <Login onLogin={alIniciar} />;
  }

  return (
    <HashRouter>
      <AppRoutes usuario={usuario} onLogout={cerrarSesion} />
    </HashRouter>
  );
}

export default App;