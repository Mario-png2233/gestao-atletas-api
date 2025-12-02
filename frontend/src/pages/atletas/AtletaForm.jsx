import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { atletaService } from '../../services/atletaService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const AtletaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    posicao: '',
    altura: '',
    peso: '',
    telefone_contato: '',
    status: 'DISPONIVEL',
    historico_medico: '',
    foto_url: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      loadAtleta();
    }
  }, [id]);

  const loadAtleta = async () => {
    try {
      const response = await atletaService.buscar(id);
      const atleta = response.data.data;
      setFormData({
        nome: atleta.nome || '',
        data_nascimento: atleta.data_nascimento?.split('T')[0] || '',
        posicao: atleta.posicao || '',
        altura: atleta.altura || '',
        peso: atleta.peso || '',
        telefone_contato: atleta.telefone_contato || '',
        status: atleta.status || 'DISPONIVEL',
        historico_medico: atleta.historico_medico || '',
        foto_url: atleta.foto_url || ''
      });
    } catch (error) {
      setToast({ message: 'Erro ao carregar atleta', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.data_nascimento) newErrors.data_nascimento = 'Data de nascimento é obrigatória';
    if (!formData.posicao) newErrors.posicao = 'Posição é obrigatória';
    if (!formData.altura) newErrors.altura = 'Altura é obrigatória';
    if (!formData.peso) newErrors.peso = 'Peso é obrigatório';
    if (!formData.telefone_contato) newErrors.telefone_contato = 'Telefone é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEditing) {
        await atletaService.atualizar(id, formData);
        setToast({ message: 'Atleta atualizado com sucesso!', type: 'success' });
      } else {
        await atletaService.criar(formData);
        setToast({ message: 'Atleta criado com sucesso!', type: 'success' });
      }
      setTimeout(() => navigate('/atletas'), 1000);
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao salvar atleta';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0">{isEditing ? 'Editar Atleta' : 'Novo Atleta'}</h1>
          <p className="text-muted mb-0">
            {isEditing ? 'Atualize os dados do atleta' : 'Cadastre um novo atleta no sistema'}
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/atletas')}>
          <FaArrowLeft className="me-2" /> Voltar
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Nome *</label>
                <input
                  type="text"
                  name="nome"
                  className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Nome completo do atleta"
                />
                {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label">Data de Nascimento *</label>
                <input
                  type="date"
                  name="data_nascimento"
                  className={`form-control ${errors.data_nascimento ? 'is-invalid' : ''}`}
                  value={formData.data_nascimento}
                  onChange={handleChange}
                />
                {errors.data_nascimento && <div className="invalid-feedback">{errors.data_nascimento}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label">Posição *</label>
                <select
                  name="posicao"
                  className={`form-select ${errors.posicao ? 'is-invalid' : ''}`}
                  value={formData.posicao}
                  onChange={handleChange}
                >
                  <option value="">Selecione...</option>
                  <option value="Goleiro">Goleiro</option>
                  <option value="Zagueiro">Zagueiro</option>
                  <option value="Lateral Direito">Lateral Direito</option>
                  <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                  <option value="Volante">Volante</option>
                  <option value="Meia">Meia</option>
                  <option value="Atacante">Atacante</option>
                </select>
                {errors.posicao && <div className="invalid-feedback">{errors.posicao}</div>}
              </div>

              <div className="col-md-2">
                <label className="form-label">Altura (m) *</label>
                <input
                  type="number"
                  name="altura"
                  step="0.01"
                  className={`form-control ${errors.altura ? 'is-invalid' : ''}`}
                  value={formData.altura}
                  onChange={handleChange}
                  placeholder="1.80"
                />
                {errors.altura && <div className="invalid-feedback">{errors.altura}</div>}
              </div>

              <div className="col-md-2">
                <label className="form-label">Peso (kg) *</label>
                <input
                  type="number"
                  name="peso"
                  step="0.1"
                  className={`form-control ${errors.peso ? 'is-invalid' : ''}`}
                  value={formData.peso}
                  onChange={handleChange}
                  placeholder="75.5"
                />
                {errors.peso && <div className="invalid-feedback">{errors.peso}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Telefone *</label>
                <input
                  type="text"
                  name="telefone_contato"
                  className={`form-control ${errors.telefone_contato ? 'is-invalid' : ''}`}
                  value={formData.telefone_contato}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
                {errors.telefone_contato && <div className="invalid-feedback">{errors.telefone_contato}</div>}
              </div>

              <div className="col-md-4">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="LESIONADO">Lesionado</option>
                  <option value="SUSPENSO">Suspenso</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Histórico Médico</label>
                <textarea
                  name="historico_medico"
                  className="form-control"
                  rows="3"
                  value={formData.historico_medico}
                  onChange={handleChange}
                  placeholder="Informações médicas relevantes..."
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <FaSave className="me-2" />
                )}
                {isEditing ? 'Atualizar' : 'Cadastrar'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/atletas')}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AtletaForm;



