import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          ⚽ Gestão de Atletas
        </Link>
        
        <div className="d-flex align-items-center">
          <Link to="/notificacoes" className="btn btn-outline-light btn-sm me-3">
            <FaBell />
          </Link>
          
          <div className="dropdown">
            <button 
              className="btn btn-outline-light btn-sm dropdown-toggle" 
              type="button" 
              data-bs-toggle="dropdown"
            >
              <FaUser className="me-1" />
              {user?.email || 'Usuário'}
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><span className="dropdown-item-text text-muted small">{user?.perfil}</span></li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={logout}>
                  <FaSignOutAlt className="me-2" />
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



