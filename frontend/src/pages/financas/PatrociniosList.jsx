import { useState, useEffect } from 'react';
import { financaService } from '../../services/financaService';
import { FaPlus, FaEdit, FaTrash, FaHandshake } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const PatrociniosList = () => {
  const [patrocinios, setPatrocinios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    empresa: '', contato: '', telefone: '', email: '',
    valor_contrato: '', data_inicio: '', data_fim: '',
    tipo: 'SECUNDARIO', status: 'ATIVO', descricao: '', contrapartidas: ''
  });

  useEffect(() => { loadPatrocinios(); }, []);

  const loadPatrocinios = async () => {
    try {
      const response = await financaService.patrocinios.listar();
      setPatrocinios(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar patrocínios', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await financaService.patrocinios.atualizar(editingId, formData);
        setToast({ message: 'Patrocínio atualizado!', type: 'success' });
      } else {
        await financaService.patrocinios.criar(formData);
        setToast({ message: 'Patrocínio criado!', type: 'success' });
      }
      loadPatrocinios(); resetForm();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao salvar', type: 'error' });
    }
  };

  const handleEdit = (p) => {
    setFormData({
      empresa: p.empresa, contato: p.contato || '', telefone: p.telefone || '',
      email: p.email || '', valor_contrato: p.valor_contrato,
      data_inicio: p.data_inicio?.split('T')[0], data_fim: p.data_fim?.split('T')[0],
      tipo: p.tipo, status: p.status, descricao: p.descricao || '', contrapartidas: p.contrapartidas || ''
    });
    setEditingId(p.id); setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await financaService.patrocinios.excluir(deleteModal.id);
      setPatrocinios(patrocinios.filter(p => p.id !== deleteModal.id));
      setToast({ message: 'Patrocínio excluído!', type: 'success' });
    } catch (error) { setToast({ message: 'Erro ao excluir', type: 'error' }); }
    finally { setDeleteModal({ show: false, id: null }); }
  };

  const resetForm = () => {
    setFormData({ empresa: '', contato: '', telefone: '', email: '', valor_contrato: '', data_inicio: '', data_fim: '', tipo: 'SECUNDARIO', status: 'ATIVO', descricao: '', contrapartidas: '' });
    setEditingId(null); setShowForm(false);
  };

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal show={deleteModal.show} title="Confirmar Exclusão" message="Excluir este patrocínio?" onConfirm={handleDelete} onCancel={() => setDeleteModal({ show: false, id: null })} />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0"><FaHandshake className="me-2" />Patrocínios</h1>
          <p className="text-muted mb-0">Gestão de patrocinadores</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><FaPlus className="me-2" />Novo Patrocínio</button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editingId ? 'Editar' : 'Novo'} Patrocínio</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Empresa *" value={formData.empresa} onChange={e => setFormData({...formData, empresa: e.target.value})} required />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Contato" value={formData.contato} onChange={e => setFormData({...formData, contato: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <input type="email" className="form-control" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <input type="number" step="0.01" className="form-control" placeholder="Valor do Contrato *" value={formData.valor_contrato} onChange={e => setFormData({...formData, valor_contrato: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input type="date" className="form-control" value={formData.data_inicio} onChange={e => setFormData({...formData, data_inicio: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <input type="date" className="form-control" value={formData.data_fim} onChange={e => setFormData({...formData, data_fim: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <select className="form-select" value={formData.tipo} onChange={e => setFormData({...formData, tipo: e.target.value})}>
                    <option value="PRINCIPAL">Principal</option>
                    <option value="SECUNDARIO">Secundário</option>
                    <option value="PONTUAL">Pontual</option>
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
            <thead>
              <tr><th>Empresa</th><th>Valor</th><th>Tipo</th><th>Período</th><th>Status</th><th width="100">Ações</th></tr>
            </thead>
            <tbody>
              {patrocinios.map(p => (
                <tr key={p.id}>
                  <td className="fw-semibold">{p.empresa}</td>
                  <td className="text-success fw-bold">{formatCurrency(p.valor_contrato)}</td>
                  <td><span className={`badge bg-${p.tipo === 'PRINCIPAL' ? 'primary' : p.tipo === 'SECUNDARIO' ? 'info' : 'secondary'}`}>{p.tipo}</span></td>
                  <td>{new Date(p.data_inicio).toLocaleDateString('pt-BR')} - {new Date(p.data_fim).toLocaleDateString('pt-BR')}</td>
                  <td><span className={`badge bg-${p.status === 'ATIVO' ? 'success' : p.status === 'PENDENTE' ? 'warning' : 'secondary'}`}>{p.status}</span></td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-secondary" onClick={() => handleEdit(p)}><FaEdit /></button>
                      <button className="btn btn-outline-danger" onClick={() => setDeleteModal({ show: true, id: p.id })}><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {patrocinios.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-5">Nenhum patrocínio</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatrociniosList;

