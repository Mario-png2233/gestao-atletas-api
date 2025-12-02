import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { atletaService } from '../../services/atletaService';
import { lesaoService } from '../../services/lesaoService';
import { exameService } from '../../services/exameService';
import { useAuth } from '../../context/AuthContext';
import { FaEdit, FaArrowLeft, FaPlus, FaHeartbeat, FaStethoscope, FaClipboardList } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const AtletaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [atleta, setAtleta] = useState(null);
  const [lesoes, setLesoes] = useState([]);
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  
  const canAccessAvaliacaoFisica = ['MEDICO', 'PREPARADOR'].includes(user?.perfil);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [atletaRes, lesoesRes, examesRes] = await Promise.all([
        atletaService.buscar(id),
        lesaoService.listarPorAtleta(id),
        exameService.listarPorAtleta(id)
      ]);
      setAtleta(atletaRes.data.data);
      setLesoes(lesoesRes.data.data || []);
      setExames(examesRes.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar dados do atleta', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!atleta) return <div className="alert alert-danger">Atleta não encontrado</div>;

  const idade = atleta.data_nascimento 
    ? Math.floor((new Date() - new Date(atleta.data_nascimento)) / 31557600000)
    : '-';

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-link text-decoration-none p-0 mb-2" onClick={() => navigate('/atletas')}>
            <FaArrowLeft className="me-1" /> Voltar para lista
          </button>
          <h1 className="h3 mb-0">{atleta.nome}</h1>
          <p className="text-muted mb-0">{atleta.posicao}</p>
        </div>
        <div className="d-flex gap-2">
          {canAccessAvaliacaoFisica && (
            <Link to={`/atletas/${id}/avaliacao-fisica`} className="btn btn-outline-success">
              <FaClipboardList className="me-2" /> Avaliação Física
            </Link>
          )}
          <Link to={`/atletas/${id}/lesoes/nova`} className="btn btn-outline-danger">
            <FaHeartbeat className="me-2" /> Registrar Lesão
          </Link>
          <Link to={`/atletas/${id}/exames/novo`} className="btn btn-outline-info">
            <FaStethoscope className="me-2" /> Novo Exame
          </Link>
          <Link to={`/atletas/${id}/editar`} className="btn btn-primary">
            <FaEdit className="me-2" /> Editar
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            Informações
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'lesoes' ? 'active' : ''}`}
            onClick={() => setActiveTab('lesoes')}
          >
            Lesões ({lesoes.length})
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'exames' ? 'active' : ''}`}
            onClick={() => setActiveTab('exames')}
          >
            Exames ({exames.length})
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3" 
                     style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                  {atleta.nome.charAt(0)}
                </div>
                <h4>{atleta.nome}</h4>
                <p className="text-muted">{atleta.posicao}</p>
                <span className={`badge bg-${
                  atleta.status === 'DISPONIVEL' ? 'success' : 
                  atleta.status === 'LESIONADO' ? 'danger' : 'warning'
                } fs-6`}>
                  {atleta.status}
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Dados Pessoais</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="text-muted small">Idade</label>
                    <p className="fw-semibold mb-0">{idade} anos</p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Data de Nascimento</label>
                    <p className="fw-semibold mb-0">
                      {atleta.data_nascimento ? new Date(atleta.data_nascimento).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Altura</label>
                    <p className="fw-semibold mb-0">{atleta.altura}m</p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Peso</label>
                    <p className="fw-semibold mb-0">{atleta.peso}kg</p>
                  </div>
                  <div className="col-md-6">
                    <label className="text-muted small">Telefone</label>
                    <p className="fw-semibold mb-0">{atleta.telefone_contato}</p>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small">Histórico Médico</label>
                    <p className="mb-0">{atleta.historico_medico || 'Nenhum histórico registrado'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lesoes' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Histórico de Lesões</h5>
            <Link to={`/atletas/${id}/lesoes/nova`} className="btn btn-sm btn-danger">
              <FaPlus className="me-1" /> Nova Lesão
            </Link>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Gravidade</th>
                  <th>Data</th>
                  <th>Previsão Retorno</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {lesoes.map(lesao => (
                  <tr key={lesao.id}>
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
                    <td>{lesao.previsao_retorno ? new Date(lesao.previsao_retorno).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                      <span className={`badge bg-${lesao.status === 'ATIVA' ? 'danger' : 'success'}`}>
                        {lesao.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {lesoes.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">
                      Nenhuma lesão registrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'exames' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Histórico de Exames</h5>
            <Link to={`/atletas/${id}/exames/novo`} className="btn btn-sm btn-info">
              <FaPlus className="me-1" /> Novo Exame
            </Link>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Próximo Exame</th>
                </tr>
              </thead>
              <tbody>
                {exames.map(exame => (
                  <tr key={exame.id}>
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
                    <td>{exame.proximo_exame ? new Date(exame.proximo_exame).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                ))}
                {exames.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      Nenhum exame registrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtletaDetails;

