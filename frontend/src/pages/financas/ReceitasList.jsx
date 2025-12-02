import { useState, useEffect } from 'react';
import { financaService } from '../../services/financaService';
import { FaPlus, FaEdit, FaTrash, FaArrowUp } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const ReceitasList = () => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '', valor: '', data: '', categoria: 'OUTROS', status: 'PENDENTE', observacoes: ''
  });

  useEffect(() => { loadReceitas(); }, []);

  const loadReceitas = async () => {
    try {
      const response = await financaService.receitas.listar();
      setReceitas(response.data.data || []);
    } catch (error) { setToast({ message: 'Erro ao carregar', type: 'error' }); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await financaService.receitas.atualizar(editingId, formData);
        setToast({ message: 'Receita atualizada!', type: 'success' });
      } else {
        await financaService.receitas.criar(formData);
        setToast({ message: 'Receita criada!', type: 'success' });
      }
      loadReceitas(); resetForm();
    } catch (error) { setToast({ message: error.response?.data?.error || 'Erro', type: 'error' }); }
  };

  const handleEdit = (r) => {
    setFormData({
      descricao: r.descricao, valor: r.valor, data: r.data?.split('T')[0],
      categoria: r.categoria, status: r.status, observacoes: r.observacoes || ''
    });
    setEditingId(r.id); setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await financaService.receitas.excluir(deleteModal.id);
      setReceitas(receitas.filter(r => r.id !== deleteModal.id));
      setToast({ message: 'Excluída!', type: 'success' });
    } catch (error) { setToast({ message: 'Erro', type: 'error' }); }
    finally { setDeleteModal({ show: false, id: null }); }
  };

  const resetForm = () => {
    setFormData({ descricao: '', valor: '', data: '', categoria: 'OUTROS', status: 'PENDENTE', observacoes: '' });
    setEditingId(null); setShowForm(false);
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal show={deleteModal.show} title="Excluir?" message="Confirma?" onConfirm={handleDelete} onCancel={() => setDeleteModal({ show: false, id: null })} />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0"><FaArrowUp className="me-2 text-success" />Receitas</h1>
          <p className="text-muted mb-0">Controle de entradas</p>
        </div>
        <button className="btn btn-success" onClick={() => setShowForm(!showForm)}><FaPlus className="me-2" />Nova Receita</button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Descrição *" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input type="number" step="0.01" className="form-control" placeholder="Valor *" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                    <option value="PATROCINIO">Patrocínio</option>
                    <option value="BILHETERIA">Bilheteria</option>
                    <option value="MENSALIDADES">Mensalidades</option>
                    <option value="PREMIACOES">Premiações</option>
                    <option value="VENDAS">Vendas</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input type="date" className="form-control" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="PENDENTE">Pendente</option>
                    <option value="RECEBIDO">Recebido</option>
                    <option value="ATRASADO">Atrasado</option>
                  </select>
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
            <thead><tr><th>Descrição</th><th>Valor</th><th>Categoria</th><th>Data</th><th>Status</th><th width="100">Ações</th></tr></thead>
            <tbody>
              {receitas.map(r => (
                <tr key={r.id}>
                  <td>{r.descricao}</td>
                  <td className="text-success fw-bold">{formatCurrency(r.valor)}</td>
                  <td><span className="badge bg-info">{r.categoria}</span></td>
                  <td>{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`badge bg-${r.status === 'RECEBIDO' ? 'success' : r.status === 'ATRASADO' ? 'danger' : 'warning'}`}>{r.status}</span></td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={() => handleEdit(r)}><FaEdit /></button>
                      <button className="btn btn-outline-danger" onClick={() => setDeleteModal({ show: true, id: r.id })}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {receitas.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-5">Nenhuma receita</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReceitasList;


