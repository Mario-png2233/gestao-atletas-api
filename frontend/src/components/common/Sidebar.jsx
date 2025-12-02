import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, FaUsers, FaHeartbeat, FaStethoscope, 
  FaFutbol, FaRunning, FaChartBar, FaBell,
  FaChessBoard, FaDollarSign, FaCalendarAlt
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useAuth();
  const perfil = user?.perfil;

  // Menu base para todos
  const menuBase = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/atletas', icon: <FaUsers />, label: 'Atletas' },
    { path: '/lesoes', icon: <FaHeartbeat />, label: 'Lesões' },
    { path: '/exames', icon: <FaStethoscope />, label: 'Exames' },
    { path: '/partidas', icon: <FaFutbol />, label: 'Partidas' },
    { path: '/treinos', icon: <FaRunning />, label: 'Treinos' },
    { path: '/calendario', icon: <FaCalendarAlt />, label: 'Calendário' },
  ];

  // Menu específico por perfil
  const menuPorPerfil = {
    TECNICO: [
      { path: '/taticas', icon: <FaChessBoard />, label: 'Táticas' },
    ],
    DIRETOR_FINANCEIRO: [
      { path: '/financas', icon: <FaDollarSign />, label: 'Finanças' },
    ],
    MEDICO: [],
    PREPARADOR: [],
  };

  // Menu final (comum a todos)
  const menuFinal = [
    { path: '/relatorios', icon: <FaChartBar />, label: 'Relatórios' },
    { path: '/notificacoes', icon: <FaBell />, label: 'Notificações' },
  ];

  // Monta o menu completo
  const menuItems = [
    ...menuBase,
    ...(menuPorPerfil[perfil] || []),
    ...menuFinal
  ];

  return (
    <div className="sidebar d-flex flex-column p-3" style={{ width: '250px' }}>
      {/* Perfil do usuário */}
      {perfil && (
        <div className="mb-3 p-2 bg-dark rounded text-center">
          <small className="text-white-50">Logado como:</small>
          <div className="badge bg-primary d-block mt-1">
            {perfil === 'DIRETOR_FINANCEIRO' ? 'DIRETOR FINANCEIRO' : perfil}
          </div>
        </div>
      )}

      <nav className="nav flex-column">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
            }
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
