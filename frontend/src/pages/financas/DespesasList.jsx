import { useState, useEffect } from 'react';
import { financaService } from '../../services/financaService';
import { FaPlus, FaEdit, FaTrash, FaArrowDown } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const DespesasList = () => {
  const [despesas, setDespesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '', valor: '', data: '', data_vencimento: '',
    categoria: 'OUTROS', status: 'PENDENTE', fornecedor: '', observacoes: ''
  });

  useEffect(() => { loadDespesas(); }, []);

  const loadDespesas = async () => {
    try {
      const response = await financaService.despesas.listar();
      setDespesas(response.data.data || []);
    } catch (error) { setToast({ message: 'Erro ao carregar', type: 'error' }); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await financaService.despesas.atualizar(editingId, formData);
        setToast({ message: 'Despesa atualizada!', type: 'success' });
      } else {
        await financaService.despesas.criar(formData);
        setToast({ message: 'Despesa criada!', type: 'success' });
      }
      loadDespesas(); resetForm();
    } catch (error) { setToast({ message: error.response?.data?.error || 'Erro', type: 'error' }); }
  };

  const handleEdit = (d) => {
    setFormData({
      descricao: d.descricao, valor: d.valor, data: d.data?.split('T')[0],
      data_vencimento: d.data_vencimento?.split('T')[0] || '', categoria: d.categoria,
      status: d.status, fornecedor: d.fornecedor || '', observacoes: d.observacoes || ''
    });
    setEditingId(d.id); setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await financaService.despesas.excluir(deleteModal.id);
      setDespesas(despesas.filter(d => d.id !== deleteModal.id));
      setToast({ message: 'Excluída!', type: 'success' });
    } catch (error) { setToast({ message: 'Erro', type: 'error' }); }
    finally { setDeleteModal({ show: false, id: null }); }
  };

  const resetForm = () => {
    setFormData({ descricao: '', valor: '', data: '', data_vencimento: '', categoria: 'OUTROS', status: 'PENDENTE', fornecedor: '', observacoes: '' });
    setEditingId(null); setShowForm(false);
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal show={deleteModal.show} title="Excluir?" message="Confirma exclusão?" onConfirm={handleDelete} onCancel={() => setDeleteModal({ show: false, id: null })} />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0"><FaArrowDown className="me-2 text-danger" />Despesas</h1>
          <p className="text-muted mb-0">Controle de saídas</p>
        </div>
        <button className="btn btn-danger" onClick={() => setShowForm(!showForm)}><FaPlus className="me-2" />Nova Despesa</button>
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
                    <option value="SALARIOS">Salários</option>
                    <option value="INFRAESTRUTURA">Infraestrutura</option>
                    <option value="EQUIPAMENTOS">Equipamentos</option>
                    <option value="VIAGENS">Viagens</option>
                    <option value="ALIMENTACAO">Alimentação</option>
                    <option value="SAUDE">Saúde</option>
                    <option value="MARKETING">Marketing</option>
                    <option value="IMPOSTOS">Impostos</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input type="date" className="form-control" value={formData.data} onChange={e => setFormData({...formData, data: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input type="date" className="form-control" placeholder="Vencimento" value={formData.data_vencimento} onChange={e => setFormData({...formData, data_vencimento: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="PENDENTE">Pendente</option>
                    <option value="PAGO">Pago</option>
                    <option value="ATRASADO">Atrasado</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <input type="text" className="form-control" placeholder="Fornecedor" value={formData.fornecedor} onChange={e => setFormData({...formData, fornecedor: e.target.value})} />
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
              {despesas.map(d => (
                <tr key={d.id}>
                  <td>{d.descricao}</td>
                  <td className="text-danger fw-bold">{formatCurrency(d.valor)}</td>
                  <td><span className="badge bg-secondary">{d.categoria}</span></td>
                  <td>{new Date(d.data).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`badge bg-${d.status === 'PAGO' ? 'success' : d.status === 'ATRASADO' ? 'danger' : 'warning'}`}>{d.status}</span></td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={() => handleEdit(d)}><FaEdit /></button>
                      <button className="btn btn-outline-danger" onClick={() => setDeleteModal({ show: true, id: d.id })}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {despesas.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-5">Nenhuma despesa</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DespesasList;



