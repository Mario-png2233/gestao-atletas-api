import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { lesaoService } from '../../services/lesaoService';
import { FaSearch } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const LesoesList = () => {
  const [lesoes, setLesoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroGravidade, setFiltroGravidade] = useState('');

  useEffect(() => {
    loadLesoes();
  }, []);

  const loadLesoes = async () => {
    try {
      const response = await lesaoService.listarTodas();
      setLesoes(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar lesões', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const lesoesFiltradas = lesoes.filter(lesao => {
    const matchStatus = !filtroStatus || lesao.status === filtroStatus;
    const matchGravidade = !filtroGravidade || lesao.gravidade === filtroGravidade;
    return matchStatus && matchGravidade;
  });

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="h3 mb-0">Lesões</h1>
        <p className="text-muted mb-0">Acompanhamento de lesões dos atletas</p>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos os Status</option>
                <option value="ATIVA">Ativa</option>
                <option value="RECUPERADA">Recuperada</option>
                <option value="CRONICA">Crônica</option>
              </select>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={filtroGravidade}
                onChange={(e) => setFiltroGravidade(e.target.value)}
              >
                <option value="">Todas as Gravidades</option>
                <option value="LEVE">Leve</option>
                <option value="MODERADA">Moderada</option>
                <option value="GRAVE">Grave</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Atleta</th>
                <th>Tipo de Lesão</th>
                <th>Gravidade</th>
                <th>Data</th>
                <th>Previsão Retorno</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lesoesFiltradas.map(lesao => (
                <tr key={lesao.id}>
                  <td>
                    <Link to={`/atletas/${lesao.atleta_id}`}>
                      {lesao.atleta?.nome || `Atleta #${lesao.atleta_id}`}
                    </Link>
                  </td>
                  <td>{lesao.tipo_lesao}</td>
                  <td>
                    <span className={`badge bg-${
                      lesao.gravidade === 'LEVE' ? 'success' : 
                      lesao.gravidade === 'MODERADA' ? 'warning' : 'danger'
                    }`}>
                      {lesao.gravidade}
                    </span>
                  </td>
                  <td>{new Date(lesao.data_lesao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    {lesao.previsao_retorno 
                      ? new Date(lesao.previsao_retorno).toLocaleDateString('pt-BR') 
                      : lesao.data_recuperacao_estimada 
                        ? new Date(lesao.data_recuperacao_estimada).toLocaleDateString('pt-BR')
                        : '-'
                    }
                  </td>
                  <td>
                    <span className={`badge bg-${
                      lesao.status === 'ATIVA' ? 'danger' : 
                      lesao.status === 'RECUPERADA' ? 'success' : 'secondary'
                    }`}>
                      {lesao.status}
                    </span>
                  </td>
                </tr>
              ))}
              {lesoesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    Nenhuma lesão encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LesoesList;

