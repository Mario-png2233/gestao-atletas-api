import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { atletaService } from '../../services/atletaService';
import { lesaoService } from '../../services/lesaoService';
import { FaUsers, FaCheckCircle, FaHeartbeat, FaBan } from 'react-icons/fa';
import Loading from '../../components/common/Loading';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    disponiveis: 0,
    lesionados: 0,
    suspensos: 0
  });
  const [atletas, setAtletas] = useState([]);
  const [lesoes, setLesoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [atletasRes, lesoesRes] = await Promise.all([
        atletaService.listar(),
        lesaoService.listarTodas()
      ]);

      const atletasData = atletasRes.data.data || [];
      const lesoesData = lesoesRes.data.data || [];

      setAtletas(atletasData);
      setLesoes(lesoesData.filter(l => l.status === 'ATIVA').slice(0, 5));

      setStats({
        total: atletasData.length,
        disponiveis: atletasData.filter(a => a.status === 'DISPONIVEL').length,
        lesionados: atletasData.filter(a => a.status === 'LESIONADO').length,
        suspensos: atletasData.filter(a => a.status === 'SUSPENSO').length
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const StatCard = ({ icon, label, value, color, link }) => (
    <div className="col-md-3">
      <Link to={link} className="text-decoration-none">
        <div className={`card stat-card ${color}`}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">{label}</h6>
                <h2 className="mb-0 fw-bold">{value}</h2>
              </div>
              <div className={`text-${color === 'success' ? 'success' : color === 'danger' ? 'danger' : color === 'warning' ? 'warning' : 'primary'}`} style={{ fontSize: '2rem' }}>
                {icon}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="h3 mb-0">Dashboard</h1>
        <p className="text-muted">Visão geral do sistema</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="row g-4 mb-4">
        <StatCard 
          icon={<FaUsers />} 
          label="Total de Atletas" 
          value={stats.total} 
          color="" 
          link="/atletas"
        />
        <StatCard 
          icon={<FaCheckCircle />} 
          label="Disponíveis" 
          value={stats.disponiveis} 
          color="success" 
          link="/atletas?status=DISPONIVEL"
        />
        <StatCard 
          icon={<FaHeartbeat />} 
          label="Lesionados" 
          value={stats.lesionados} 
          color="danger" 
          link="/atletas?status=LESIONADO"
        />
        <StatCard 
          icon={<FaBan />} 
          label="Suspensos" 
          value={stats.suspensos} 
          color="warning" 
          link="/atletas?status=SUSPENSO"
        />
      </div>

      <div className="row g-4">
        {/* Últimos Atletas */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Atletas Recentes</h5>
              <Link to="/atletas" className="btn btn-sm btn-primary">Ver todos</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Posição</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {atletas.slice(0, 5).map(atleta => (
                    <tr key={atleta.id}>
                      <td>
                        <Link to={`/atletas/${atleta.id}`}>{atleta.nome}</Link>
                      </td>
                      <td>{atleta.posicao}</td>
                      <td>
                        <span className={`badge bg-${
                          atleta.status === 'DISPONIVEL' ? 'success' : 
                          atleta.status === 'LESIONADO' ? 'danger' : 'warning'
                        }`}>
                          {atleta.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {atletas.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        Nenhum atleta cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Lesões Ativas */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Lesões Ativas</h5>
              <Link to="/lesoes" className="btn btn-sm btn-danger">Ver todas</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Atleta</th>
                    <th>Tipo</th>
                    <th>Gravidade</th>
                  </tr>
                </thead>
                <tbody>
                  {lesoes.map(lesao => (
                    <tr key={lesao.id}>
                      <td>{lesao.atleta?.nome || `Atleta #${lesao.atleta_id}`}</td>
                      <td>{lesao.tipo_lesao}</td>
                      <td>
                        <span className={`badge bg-${
                          lesao.gravidade === 'LEVE' ? 'success' : 
                          lesao.gravidade === 'MODERADA' ? 'warning' : 'danger'
                        }`}>
                          {lesao.gravidade}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {lesoes.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        Nenhuma lesão ativa
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;



