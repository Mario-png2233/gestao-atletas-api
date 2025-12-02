import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { atletaService } from '../../services/atletaService';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const AtletasList = () => {
  const [atletas, setAtletas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [filtro, setFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  useEffect(() => {
    loadAtletas();
  }, []);

  const loadAtletas = async () => {
    try {
      const response = await atletaService.listar();
      setAtletas(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar atletas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await atletaService.excluir(deleteModal.id);
      setAtletas(atletas.filter(a => a.id !== deleteModal.id));
      setToast({ message: 'Atleta excluído com sucesso', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao excluir atleta', type: 'error' });
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const atletasFiltrados = atletas.filter(atleta => {
    const matchNome = atleta.nome.toLowerCase().includes(filtro.toLowerCase());
    const matchStatus = !statusFiltro || atleta.status === statusFiltro;
    return matchNome && matchStatus;
  });

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        show={deleteModal.show}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este atleta? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null })}
      />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Atletas</h1>
          <p className="text-muted mb-0">Gerenciar atletas do time</p>
        </div>
        <Link to="/atletas/novo" className="btn btn-primary">
          <FaPlus className="me-2" /> Novo Atleta
        </Link>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nome..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
              >
                <option value="">Todos os Status</option>
                <option value="DISPONIVEL">Disponível</option>
                <option value="LESIONADO">Lesionado</option>
                <option value="SUSPENSO">Suspenso</option>
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
                <th>Nome</th>
                <th>Posição</th>
                <th>Idade</th>
                <th>Status</th>
                <th>Telefone</th>
                <th width="150">Ações</th>
              </tr>
            </thead>
            <tbody>
              {atletasFiltrados.map(atleta => {
                const idade = atleta.data_nascimento 
                  ? Math.floor((new Date() - new Date(atleta.data_nascimento)) / 31557600000)
                  : '-';
                return (
                  <tr key={atleta.id}>
                    <td className="fw-semibold">{atleta.nome}</td>
                    <td>{atleta.posicao}</td>
                    <td>{idade} anos</td>
                    <td>
                      <span className={`badge bg-${
                        atleta.status === 'DISPONIVEL' ? 'success' : 
                        atleta.status === 'LESIONADO' ? 'danger' : 'warning'
                      }`}>
                        {atleta.status}
                      </span>
                    </td>
                    <td>{atleta.telefone_contato}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <Link to={`/atletas/${atleta.id}`} className="btn btn-outline-primary" title="Ver">
                          <FaEye />
                        </Link>
                        <Link to={`/atletas/${atleta.id}/editar`} className="btn btn-outline-secondary" title="Editar">
                          <FaEdit />
                        </Link>
                        <button 
                          className="btn btn-outline-danger" 
                          title="Excluir"
                          onClick={() => setDeleteModal({ show: true, id: atleta.id })}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {atletasFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    {atletas.length === 0 ? 'Nenhum atleta cadastrado' : 'Nenhum atleta encontrado com os filtros aplicados'}
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

export default AtletasList;

