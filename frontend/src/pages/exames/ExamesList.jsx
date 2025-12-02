import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exameService } from '../../services/exameService';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const ExamesList = () => {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    loadExames();
  }, []);

  const loadExames = async () => {
    try {
      const response = await exameService.listarTodos();
      setExames(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar exames', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const examesFiltrados = exames.filter(exame => {
    return !filtroStatus || exame.status === filtroStatus;
  });

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="h3 mb-0">Exames Médicos</h1>
        <p className="text-muted mb-0">Acompanhamento de exames dos atletas</p>
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
                <option value="PENDENTE">Pendente</option>
                <option value="APROVADO">Aprovado</option>
                <option value="REPROVADO">Reprovado</option>
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
                <th>Tipo de Exame</th>
                <th>Data</th>
                <th>Status</th>
                <th>Próximo Exame</th>
              </tr>
            </thead>
            <tbody>
              {examesFiltrados.map(exame => (
                <tr key={exame.id}>
                  <td>
                    <Link to={`/atletas/${exame.atleta_id}`}>
                      {exame.atleta?.nome || `Atleta #${exame.atleta_id}`}
                    </Link>
                  </td>
                  <td>{exame.tipo_exame}</td>
                  <td>{new Date(exame.data_exame).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={`badge bg-${
                      exame.status === 'APROVADO' ? 'success' : 
                      exame.status === 'REPROVADO' ? 'danger' : 'warning'
                    }`}>
                      {exame.status}
                    </span>
                  </td>
                  <td>
                    {exame.proximo_exame 
                      ? new Date(exame.proximo_exame).toLocaleDateString('pt-BR')
                      : '-'
                    }
                  </td>
                </tr>
              ))}
              {examesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-5">
                    Nenhum exame encontrado
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

export default ExamesList;

