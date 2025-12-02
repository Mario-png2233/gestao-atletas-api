import { useState, useEffect } from 'react';
import { treinoService } from '../../services/treinoService';
import { FaPlus, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const TreinosList = () => {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tipo_treino: '',
    descricao: '',
    data_hora: '',
    local: '',
    duracao_minutos: 90,
    observacoes: ''
  });

  useEffect(() => {
    loadTreinos();
  }, []);

  const loadTreinos = async () => {
    try {
      const response = await treinoService.listar();
      setTreinos(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar treinos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await treinoService.atualizar(editingId, formData);
        setToast({ message: 'Treino atualizado!', type: 'success' });
      } else {
        await treinoService.criar(formData);
        setToast({ message: 'Treino criado!', type: 'success' });
      }
      loadTreinos();
      resetForm();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao salvar', type: 'error' });
    }
  };

  const handleEdit = (treino) => {
    setFormData({
      tipo_treino: treino.tipo_treino,
      descricao: treino.descricao,
      data_hora: treino.data_hora?.replace(' ', 'T').slice(0, 16),
      local: treino.local,
      duracao_minutos: treino.duracao_minutos,
      observacoes: treino.observacoes || ''
    });
    setEditingId(treino.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await treinoService.excluir(deleteModal.id);
      setTreinos(treinos.filter(t => t.id !== deleteModal.id));
      setToast({ message: 'Treino excluído!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao excluir', type: 'error' });
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const resetForm = () => {
    setFormData({ tipo_treino: '', descricao: '', data_hora: '', local: '', duracao_minutos: 90, observacoes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        show={deleteModal.show}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este treino?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null })}
      />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Treinos</h1>
          <p className="text-muted mb-0">Gerenciar sessões de treino</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus className="me-2" /> Novo Treino
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editingId ? 'Editar Treino' : 'Novo Treino'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <select className="form-select" value={formData.tipo_treino} onChange={e => setFormData({...formData, tipo_treino: e.target.value})} required>
                    <option value="">Tipo de Treino *</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Tático">Tático</option>
                    <option value="Físico">Físico</option>
                    <option value="Recuperação">Recuperação</option>
                    <option value="Coletivo">Coletivo</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <input type="datetime-local" className="form-control" 
                    value={formData.data_hora} onChange={e => setFormData({...formData, data_hora: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Local *" 
                    value={formData.local} onChange={e => setFormData({...formData, local: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="Duração" 
                      value={formData.duracao_minutos} onChange={e => setFormData({...formData, duracao_minutos: e.target.value})} required />
                    <span className="input-group-text">min</span>
                  </div>
                </div>
                <div className="col-md-9">
                  <input type="text" className="form-control" placeholder="Descrição *" 
                    value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} required />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-success me-2">Salvar</button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Data/Hora</th>
                <th>Local</th>
                <th>Duração</th>
                <th>Atletas</th>
                <th width="100">Ações</th>
              </tr>
            </thead>
            <tbody>
              {treinos.map(treino => (
                <tr key={treino.id}>
                  <td><span className="badge bg-success">{treino.tipo_treino}</span></td>
                  <td>{treino.descricao}</td>
                  <td>{new Date(treino.data_hora).toLocaleString('pt-BR')}</td>
                  <td>{treino.local}</td>
                  <td>{treino.duracao_minutos} min</td>
                  <td><FaUsers className="me-1" />{treino.atletas?.length || 0}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={() => handleEdit(treino)}><FaEdit /></button>
                      <button className="btn btn-outline-danger" onClick={() => setDeleteModal({ show: true, id: treino.id })}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {treinos.length === 0 && (
                <tr><td colSpan="7" className="text-center text-muted py-5">Nenhum treino cadastrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TreinosList;

