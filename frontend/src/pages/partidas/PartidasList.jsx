import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { partidaService } from '../../services/partidaService';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const PartidasList = () => {
  const [partidas, setPartidas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    adversario: '',
    competicao: '',
    tipo: 'OFICIAL',
    data_hora: '',
    local: '',
    observacoes: ''
  });

  useEffect(() => {
    loadPartidas();
  }, []);

  const loadPartidas = async () => {
    try {
      const response = await partidaService.listar();
      setPartidas(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar partidas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await partidaService.atualizar(editingId, formData);
        setToast({ message: 'Partida atualizada!', type: 'success' });
      } else {
        await partidaService.criar(formData);
        setToast({ message: 'Partida criada!', type: 'success' });
      }
      loadPartidas();
      resetForm();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao salvar', type: 'error' });
    }
  };

  const handleEdit = (partida) => {
    setFormData({
      adversario: partida.adversario,
      competicao: partida.competicao,
      tipo: partida.tipo,
      data_hora: partida.data_hora?.replace(' ', 'T').slice(0, 16),
      local: partida.local,
      observacoes: partida.observacoes || ''
    });
    setEditingId(partida.id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await partidaService.excluir(deleteModal.id);
      setPartidas(partidas.filter(p => p.id !== deleteModal.id));
      setToast({ message: 'Partida excluída!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao excluir', type: 'error' });
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const resetForm = () => {
    setFormData({ adversario: '', competicao: '', tipo: 'OFICIAL', data_hora: '', local: '', observacoes: '' });
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
        message="Tem certeza que deseja excluir esta partida?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null })}
      />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">Partidas</h1>
          <p className="text-muted mb-0">Gerenciar partidas e jogos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <FaPlus className="me-2" /> Nova Partida
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editingId ? 'Editar Partida' : 'Nova Partida'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Adversário *" 
                    value={formData.adversario} onChange={e => setFormData({...formData, adversario: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Competição *" 
                    value={formData.competicao} onChange={e => setFormData({...formData, competicao: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <select className="form-select" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="OFICIAL">Oficial</option>
                    <option value="AMISTOSO">Amistoso</option>
                    <option value="TREINO">Treino</option>
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
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Observações" 
                    value={formData.observacoes} onChange={e => setFormData({...formData, observacoes: e.target.value})} />
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
                <th>Adversário</th>
                <th>Competição</th>
                <th>Tipo</th>
                <th>Data/Hora</th>
                <th>Local</th>
                <th width="100">Ações</th>
              </tr>
            </thead>
            <tbody>
              {partidas.map(partida => (
                <tr key={partida.id}>
                  <td className="fw-semibold">{partida.adversario}</td>
                  <td>{partida.competicao}</td>
                  <td><span className={`badge bg-${partida.tipo === 'OFICIAL' ? 'primary' : partida.tipo === 'AMISTOSO' ? 'info' : 'secondary'}`}>{partida.tipo}</span></td>
                  <td>{new Date(partida.data_hora).toLocaleString('pt-BR')}</td>
                  <td>{partida.local}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={() => handleEdit(partida)}><FaEdit /></button>
                      <button className="btn btn-outline-danger" onClick={() => setDeleteModal({ show: true, id: partida.id })}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {partidas.length === 0 && (
                <tr><td colSpan="6" className="text-center text-muted py-5">Nenhuma partida cadastrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartidasList;

