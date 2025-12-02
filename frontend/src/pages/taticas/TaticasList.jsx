import { useState, useEffect } from 'react';
import { taticaService } from '../../services/taticaService';
import CampoTatico from '../../components/taticas/CampoTatico';
import { FaPlus, FaEdit, FaTrash, FaChessBoard, FaEye, FaTimes } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import ConfirmModal from '../../components/common/ConfirmModal';

const TaticasList = () => {
  const [taticas, setTaticas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingTatica, setViewingTatica] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    formacao: '4-4-2',
    descricao: '',
    instrucoes_ataque: '',
    instrucoes_defesa: '',
    jogadas_ensaiadas: '',
    posicoes_jogadores: null,
    ativa: true
  });

  useEffect(() => {
    loadTaticas();
  }, []);

  const loadTaticas = async () => {
    try {
      const response = await taticaService.listar();
      setTaticas(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar táticas', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await taticaService.atualizar(editingId, formData);
        setToast({ message: 'Tática atualizada!', type: 'success' });
      } else {
        await taticaService.criar(formData);
        setToast({ message: 'Tática criada!', type: 'success' });
      }
      loadTaticas();
      resetForm();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao salvar', type: 'error' });
    }
  };

  const handleEdit = (tatica) => {
    setFormData({
      nome: tatica.nome,
      formacao: tatica.formacao,
      descricao: tatica.descricao,
      instrucoes_ataque: tatica.instrucoes_ataque || '',
      instrucoes_defesa: tatica.instrucoes_defesa || '',
      jogadas_ensaiadas: tatica.jogadas_ensaiadas || '',
      posicoes_jogadores: tatica.posicoes_jogadores || null,
      ativa: tatica.ativa
    });
    setEditingId(tatica.id);
    setShowForm(true);
    setViewingTatica(null);
  };

  const handleDelete = async () => {
    try {
      await taticaService.excluir(deleteModal.id);
      setTaticas(taticas.filter(t => t.id !== deleteModal.id));
      setToast({ message: 'Tática excluída!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao excluir', type: 'error' });
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  const handleSavePosicoes = (posicoes) => {
    setFormData(prev => ({ ...prev, posicoes_jogadores: posicoes }));
    setToast({ message: 'Posições salvas no formulário!', type: 'success' });
  };

  const resetForm = () => {
    setFormData({
      nome: '', formacao: '4-4-2', descricao: '',
      instrucoes_ataque: '', instrucoes_defesa: '', jogadas_ensaiadas: '',
      posicoes_jogadores: null, ativa: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleViewTatica = (tatica) => {
    setViewingTatica(tatica);
    setShowForm(false);
  };

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmModal
        show={deleteModal.show}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta tática?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ show: false, id: null })}
      />

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0"><FaChessBoard className="me-2" />Táticas</h1>
          <p className="text-muted mb-0">Gestão de formações e estratégias</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setViewingTatica(null); }}>
          <FaPlus className="me-2" /> Nova Tática
        </button>
      </div>

      {/* Visualização de Tática */}
      {viewingTatica && (
        <div className="card mb-4 border-primary">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <FaChessBoard className="me-2" />
              {viewingTatica.nome} - {viewingTatica.formacao}
            </h5>
            <button className="btn btn-light btn-sm" onClick={() => setViewingTatica(null)}>
              <FaTimes />
            </button>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <CampoTatico 
                  formacao={viewingTatica.formacao}
                  posicoes={viewingTatica.posicoes_jogadores}
                  readOnly={true}
                />
              </div>
              <div className="col-md-6">
                <h6 className="text-muted mb-3">Descrição</h6>
                <p>{viewingTatica.descricao}</p>
                
                {viewingTatica.instrucoes_ataque && (
                  <>
                    <h6 className="text-success mb-2">Instruções de Ataque</h6>
                    <p className="small">{viewingTatica.instrucoes_ataque}</p>
                  </>
                )}
                
                {viewingTatica.instrucoes_defesa && (
                  <>
                    <h6 className="text-danger mb-2">Instruções de Defesa</h6>
                    <p className="small">{viewingTatica.instrucoes_defesa}</p>
                  </>
                )}
                
                {viewingTatica.jogadas_ensaiadas && (
                  <>
                    <h6 className="text-primary mb-2">Jogadas Ensaiadas</h6>
                    <p className="small">{viewingTatica.jogadas_ensaiadas}</p>
                  </>
                )}

                <div className="mt-3">
                  <button className="btn btn-outline-primary me-2" onClick={() => handleEdit(viewingTatica)}>
                    <FaEdit className="me-1" /> Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulário */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">{editingId ? 'Editar Tática' : 'Nova Tática'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nome da Tática *</label>
                  <input type="text" className="form-control" placeholder="Ex: Contra-ataque rápido"
                    value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} required />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Formação *</label>
                  <select className="form-select" value={formData.formacao} onChange={e => setFormData({...formData, formacao: e.target.value, posicoes_jogadores: null})}>
                    <option value="4-4-2">4-4-2</option>
                    <option value="4-3-3">4-3-3</option>
                    <option value="4-2-3-1">4-2-3-1</option>
                    <option value="3-5-2">3-5-2</option>
                    <option value="3-4-3">3-4-3</option>
                    <option value="5-3-2">5-3-2</option>
                    <option value="4-1-4-1">4-1-4-1</option>
                    <option value="4-5-1">4-5-1</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={formData.ativa} onChange={e => setFormData({...formData, ativa: e.target.value === 'true'})}>
                    <option value="true">Ativa</option>
                    <option value="false">Inativa</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Descrição *</label>
                  <textarea className="form-control" rows="2" placeholder="Descrição geral da tática..."
                    value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} required />
                </div>

                {/* Campo Tático Visual */}
                <div className="col-12">
                  <div className="card bg-light">
                    <div className="card-body">
                      <h6 className="mb-3">Posicionar Jogadores no Campo</h6>
                      <CampoTatico 
                        formacao={formData.formacao}
                        posicoes={formData.posicoes_jogadores}
                        onSave={handleSavePosicoes}
                        readOnly={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Instruções de Ataque</label>
                  <textarea className="form-control" rows="3" placeholder="Como a equipe deve atacar..."
                    value={formData.instrucoes_ataque} onChange={e => setFormData({...formData, instrucoes_ataque: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Instruções de Defesa</label>
                  <textarea className="form-control" rows="3" placeholder="Como a equipe deve defender..."
                    value={formData.instrucoes_defesa} onChange={e => setFormData({...formData, instrucoes_defesa: e.target.value})} />
                </div>
                <div className="col-12">
                  <label className="form-label">Jogadas Ensaiadas</label>
                  <textarea className="form-control" rows="2" placeholder="Escanteios, faltas, pênaltis..."
                    value={formData.jogadas_ensaiadas} onChange={e => setFormData({...formData, jogadas_ensaiadas: e.target.value})} />
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

      {/* Lista de Táticas */}
      <div className="row g-4">
        {taticas.map(tatica => (
          <div className="col-md-6 col-lg-4" key={tatica.id}>
            <div className={`card h-100 ${!tatica.ativa ? 'opacity-50' : ''}`}>
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{tatica.nome}</h5>
                <span className="badge bg-primary fs-6">{tatica.formacao}</span>
              </div>
              <div className="card-body">
                <p className="text-muted">{tatica.descricao}</p>
                {tatica.instrucoes_ataque && (
                  <div className="mb-2">
                    <small className="text-success fw-bold">Ataque:</small>
                    <p className="small mb-0">{tatica.instrucoes_ataque.substring(0, 100)}...</p>
                  </div>
                )}
                {tatica.instrucoes_defesa && (
                  <div className="mb-2">
                    <small className="text-danger fw-bold">Defesa:</small>
                    <p className="small mb-0">{tatica.instrucoes_defesa.substring(0, 100)}...</p>
                  </div>
                )}
              </div>
              <div className="card-footer bg-transparent">
                <div className="d-flex justify-content-between align-items-center">
                  <span className={`badge ${tatica.ativa ? 'bg-success' : 'bg-secondary'}`}>
                    {tatica.ativa ? 'Ativa' : 'Inativa'}
                  </span>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-outline-primary" onClick={() => handleViewTatica(tatica)} title="Visualizar Campo">
                      <FaEye />
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => handleEdit(tatica)} title="Editar">
                      <FaEdit />
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => setDeleteModal({ show: true, id: tatica.id })} title="Excluir">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {taticas.length === 0 && !showForm && (
          <div className="col-12 text-center py-5">
            <FaChessBoard className="text-muted mb-3" style={{ fontSize: '4rem' }} />
            <p className="text-muted">Nenhuma tática cadastrada</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <FaPlus className="me-2" /> Criar primeira tática
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaticasList;
