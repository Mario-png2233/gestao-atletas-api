import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { exameService } from '../../services/exameService';
import { atletaService } from '../../services/atletaService';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const ExameForm = () => {
  const { atletaId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [atleta, setAtleta] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    tipo_exame: '',
    data_exame: new Date().toISOString().split('T')[0],
    resultados: '',
    status: 'PENDENTE',
    recomendacoes: '',
    proximo_exame: ''
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
    if (!formData.tipo_exame) newErrors.tipo_exame = 'Tipo de exame é obrigatório';
    if (!formData.data_exame) newErrors.data_exame = 'Data do exame é obrigatória';
    if (!formData.resultados) newErrors.resultados = 'Resultados são obrigatórios';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await exameService.criar(atletaId, formData);
      setToast({ message: 'Exame registrado com sucesso!', type: 'success' });
      setTimeout(() => navigate(`/atletas/${atletaId}`), 1000);
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao registrar exame';
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
          <h1 className="h3 mb-0">Registrar Exame</h1>
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
                <label className="form-label">Tipo de Exame *</label>
                <select
                  name="tipo_exame"
                  className={`form-select ${errors.tipo_exame ? 'is-invalid' : ''}`}
                  value={formData.tipo_exame}
                  onChange={handleChange}
                >
                  <option value="">Selecione...</option>
                  <option value="Cardiológico">Cardiológico</option>
                  <option value="Ortopédico">Ortopédico</option>
                  <option value="Físico">Avaliação Física</option>
                  <option value="Sangue">Exame de Sangue</option>
                  <option value="Imagem">Exame de Imagem</option>
                  <option value="Outro">Outro</option>
                </select>
                {errors.tipo_exame && <div className="invalid-feedback">{errors.tipo_exame}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label">Data do Exame *</label>
                <input
                  type="date"
                  name="data_exame"
                  className={`form-control ${errors.data_exame ? 'is-invalid' : ''}`}
                  value={formData.data_exame}
                  onChange={handleChange}
                />
                {errors.data_exame && <div className="invalid-feedback">{errors.data_exame}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label">Status *</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="PENDENTE">Pendente</option>
                  <option value="APROVADO">Aprovado</option>
                  <option value="REPROVADO">Reprovado</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Resultados *</label>
                <textarea
                  name="resultados"
                  className={`form-control ${errors.resultados ? 'is-invalid' : ''}`}
                  rows="3"
                  value={formData.resultados}
                  onChange={handleChange}
                  placeholder="Descreva os resultados do exame..."
                />
                {errors.resultados && <div className="invalid-feedback">{errors.resultados}</div>}
              </div>

              <div className="col-md-8">
                <label className="form-label">Recomendações</label>
                <textarea
                  name="recomendacoes"
                  className="form-control"
                  rows="2"
                  value={formData.recomendacoes}
                  onChange={handleChange}
                  placeholder="Recomendações médicas..."
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Próximo Exame</label>
                <input
                  type="date"
                  name="proximo_exame"
                  className="form-control"
                  value={formData.proximo_exame}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-info text-white" disabled={saving}>
                {saving ? (
                  <span className="spinner-border spinner-border-sm me-2" />
                ) : (
                  <FaSave className="me-2" />
                )}
                Registrar Exame
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

export default ExameForm;

