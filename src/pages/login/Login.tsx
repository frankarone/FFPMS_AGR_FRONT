import { useState } from 'react';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { login } from '../../services/authService';
import type { Usuario } from '../../types/auth';
import logoEmpresa from '../../assets/logoagr.png';
import './Login.css';

interface Props {
    onLogin: (usuario: Usuario) => void;
}

function Login ({ onLogin }: Props) {
    const [userName, setUserName] = useState ('');
    const [password, setPassword] = useState ('');
    const [verClave, setVerClave] = useState (false);
    const [error, setError] = useState ('');
    const [cargando, setCargando] = useState (false);

    const entrar = async () => {
        setError('');
        if (!userName || !password){
            setError('Ingresar usuario y contrasena');
            return;
        }
        setCargando(true);
        try {
            const datos = await login(userName, password);
            if (datos.ok && datos.token && datos.usuario){
                localStorage.setItem('token', datos.token);
                localStorage.setItem('usuario', JSON.stringify(datos.usuario));
                onLogin(datos.usuario);
            } else {
                setError(datos.mensaje || 'Error al iniciar sesión');
            }
        } catch {
            setError('No se pudo conectar con el servidor');
        } finally {
            setCargando(false);
        }
    };

    return(
        <div className="login-fondo">
            <div className="login-overlay"></div>

            <div className="login-caja">
                <img src={logoEmpresa} alt="AGROINDUSTRIAS HUARAL" className="login-logo" />
                <p className="login-sub">Iniciar Sesión</p>

                <div className="login-campo">
                    <FaUser className="login-icono" />
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && entrar()}
                    />
                </div>

                <div className="login-campo">
                    <FaLock className="login-icono" />
                    <input
                        type={verClave ? 'text': 'password'}
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && entrar()}
                    />
                    <button type="button" className="login-ojo" onClick={() => setVerClave(!verClave)}>
                        {verClave ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                {error && <p className="login-error">{error}</p>}

                <button className="login-boton" onClick={entrar} disabled={cargando}>
                    {cargando ? 'INGRESANDO...' : 'INGRESAR'}
                </button>
            </div>
        </div>
    );
}

export default Login;