import { Link } from 'react-router-dom';
import logo from '../img/logoagr.png';
import { FaUserShield , FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

interface Props {
    usuario: { nombre?: string; userName: string; roles: string[]};
    onLogout: () => void;
}

function Navbar({ usuario, onLogout }: Props) {
    const rol= usuario.roles && usuario.roles.length > 0 ? usuario.roles[0]: 'Usuario';
    const nombre= usuario.nombre || usuario.userName;

    return (
        <nav className="navbar">
            <div className="navbar-izq">  
                <Link to="/" className="navbar-marca">
                    <img src={logo} alt="AGRIHUSAC" className="navbar-logo"/>                                               
                        <span className="navbar-titulo">FFPMS</span>
                </Link>  
                <span className="navbar-rol">
                    <FaUserShield className="navbar-icono" />{rol}                  
                </span>
            </div>
            <div className="navbar-der">
                <span className="navbar-usuario">
                    <FaUserCircle className="navbar-icono" />{nombre}                   
                </span>
                <button className="navbar-logout" onClick={onLogout}>
                    <FaSignOutAlt /> Salir
                </button>
            </div>
        </nav>
    );
}

export default Navbar;