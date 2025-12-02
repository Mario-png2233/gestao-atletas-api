import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lesaoService } from '../../services/lesaoService';
import { atletaService } from '../../services/atletaService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const LesaoForm = () => {
  const { atletaId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [atleta, setAtleta] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    tipo_lesao: '',
    gravidade: 'LEVE',
    descricao: '',
    data_lesao: new Date().toISOString().split('T')[0],
    data_recuperacao_estimada: '',
    tratamento_prescrito: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadAtleta();
  }, [atletaId]);

  const loadAtleta = async () => {
    try {
      const response = await atletaService.buscar(atletaId);
      setAtleta(response.data.data);
    } catch (error) {
      setToast({ message: 'Atleta não encontrado', type: 'error' });
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
    if (!formData.tipo_lesao) newErrors.tipo_lesao = 'Tipo de lesão é obrigatório';
    if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.data_lesao) newErrors.data_lesao = 'Data da lesão é obrigatória';
    if (!formData.data_recuperacao_estimada) newErrors.data_recuperacao_estimada = 'Previsão de retorno é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await lesaoService.criar(atletaId, formData);
      setToast({ message: 'Lesão registrada com sucesso!', type: 'success' });
      setTimeout(() => navigate(`/atletas/${atletaId}`), 1000);
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao registrar lesão';
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
          <h1 className="h3 mb-0">Registrar Lesão</h1>
          <p className="text-muted mb-0">Atleta: {atleta?.nome}</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate(`/atletas/${atletaId}`)}>
          <FaArrowLeft className="me-2" /> Voltar
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Lesão *</label>
                <input
                  type="text"
                  name="tipo_lesao"
                  className={`form-control ${errors.tipo_lesao ? 'is-invalid' : ''}`}
                  value={formData.tipo_lesao}
                  onChange={handleChange}
                  placeholder="Ex: Entorse de tornozelo"
                />
                {errors.tipo_lesao && <div className="invalid-feedback">{errors.tipo_lesao}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Gravidade *</label>
                <select
                  name="gravidade"
                  className="form-select"
                  value={formData.gravidade}
                  onChange={handleChange}
                >
                  <option value="LEVE">Leve</option>
                  <option value="MODERADA">Moderada</option>
                  <option value="GRAVE">Grave</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Data da Lesão *</label>
                <input
                  type="date"
                  name="data_lesao"
                  className={`form-control ${errors.data_lesao ? 'is-invalid' : ''}`}
                  value={formData.data_lesao}
                  onChange={handleChange}
                />
                {errors.data_lesao && <div className="invalid-feedback">{errors.data_lesao}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label">Previsão de Retorno *</label>
                <input
                  type="date"
                  name="data_recuperacao_estimada"
                  className={`form-control ${errors.data_recuperacao_estimada ? 'is-invalid' : ''}`}
                  value={formData.data_recuperacao_estimada}
                  onChange={handleChange}
                />
                {errors.data_recuperacao_estimada && <div className="invalid-feedback">{errors.data_recuperacao_estimada}</div>}
              </div>

              <div className="col-12">
                <label className="form-label">Descrição *</label>
                <textarea
                  name="descricao"
                  className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
                  rows="3"
                  value={formData.descricao}
                  onChange={handleChange}
                  placeholder="Descreva a lesão detalhadamente..."
                />
                {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
              </div>

              <div className="col-12">
                <label className="form-label">Tratamento Prescrito</label>
                <textarea
                  name="tratamento_prescrito"
                  className="form-control"
                  rows="3"
                  value={formData.tratamento_prescrito}
                  onChange={handleChange}
                  placeholder="Descreva o tratamento..."
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-danger" disabled={saving}>
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <FaSave className="me-2" />
                )}
                Registrar Lesão
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(`/atletas/${atletaId}`)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LesaoForm;


