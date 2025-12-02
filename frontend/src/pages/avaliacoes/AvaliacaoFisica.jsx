import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atletaService } from '../../services/atletaService';
import { avaliacaoService } from '../../services/avaliacaoService';
import { gerarPDFAvaliacaoFisica } from '../../services/pdfService';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaHeartbeat, FaSave, FaFilePdf, FaWeight, FaRunning } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const AvaliacaoFisica = () => {
  const { atletaId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [atleta, setAtleta] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('nova');
  
  const [formData, setFormData] = useState({
    data_avaliacao: new Date().toISOString().split('T')[0],
    // Cardíacos
    batimentos_repouso: '',
    batimentos_esforco: '',
    pressao_arterial: '',
    // Composição corporal
    peso: '',
    altura: '',
    percentual_gordura: '',
    massa_muscular: '',
    // Performance
    vo2_max: '',
    flexibilidade: '',
    velocidade_10m: '',
    velocidade_40m: '',
    salto_vertical: '',
    resistencia_abdominal: '',
    // Resultado
    status: 'APTO',
    observacoes: '',
    recomendacoes: ''
  });

  useEffect(() => {
    loadData();
  }, [atletaId]);

  const loadData = async () => {
    try {
      const [atletaRes, avaliacoesRes] = await Promise.all([
        atletaService.buscar(atletaId),
        avaliacaoService.listarPorAtleta(atletaId)
      ]);
      setAtleta(atletaRes.data.data);
      setAvaliacoes(avaliacoesRes.data.data || []);
      
      // Preenche peso e altura do atleta se disponíveis
      if (atletaRes.data.data) {
        setFormData(prev => ({
          ...prev,
          peso: atletaRes.data.data.peso || '',
          altura: atletaRes.data.data.altura || ''
        }));
      }
    } catch (error) {
      setToast({ message: 'Erro ao carregar dados', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calcularIMC = () => {
    if (formData.peso && formData.altura) {
      const imc = parseFloat(formData.peso) / (parseFloat(formData.altura) ** 2);
      return imc.toFixed(1);
    }
    return '-';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dados = { ...formData };
      // Converte strings vazias para null
      Object.keys(dados).forEach(key => {
        if (dados[key] === '') dados[key] = null;
      });

      await avaliacaoService.criar(atletaId, dados);
      setToast({ message: 'Avaliação salva com sucesso!', type: 'success' });
      
      // Recarrega lista
      const avaliacoesRes = await avaliacaoService.listarPorAtleta(atletaId);
      setAvaliacoes(avaliacoesRes.data.data || []);
      
      // Limpa formulário
      setFormData({
        data_avaliacao: new Date().toISOString().split('T')[0],
        batimentos_repouso: '',
        batimentos_esforco: '',
        pressao_arterial: '',
        peso: atleta?.peso || '',
        altura: atleta?.altura || '',
        percentual_gordura: '',
        massa_muscular: '',
        vo2_max: '',
        flexibilidade: '',
        velocidade_10m: '',
        velocidade_40m: '',
        salto_vertical: '',
        resistencia_abdominal: '',
        status: 'APTO',
        observacoes: '',
        recomendacoes: ''
      });
      
      setActiveTab('historico');
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao salvar avaliação', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleGerarPDF = (avaliacao) => {
    try {
      gerarPDFAvaliacaoFisica(atleta, avaliacao, user?.email || 'Responsável');
      setToast({ message: 'PDF gerado com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' });
    }
  };

  if (loading) return <Loading />;
  if (!atleta) return <div className="alert alert-danger">Atleta não encontrado</div>;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-link text-decoration-none p-0 mb-2" onClick={() => navigate(`/atletas/${atletaId}`)}>
            <FaArrowLeft className="me-1" /> Voltar para atleta
          </button>
          <h1 className="h3 mb-0">
            <FaHeartbeat className="me-2 text-danger" />
            Avaliação Física
          </h1>
          <p className="text-muted mb-0">Atleta: {atleta.nome}</p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'nova' ? 'active' : ''}`}
            onClick={() => setActiveTab('nova')}
          >
            <FaHeartbeat className="me-2" />
            Nova Avaliação
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'historico' ? 'active' : ''}`}
            onClick={() => setActiveTab('historico')}
          >
            Histórico ({avaliacoes.length})
          </button>
        </li>
      </ul>

      {/* Nova Avaliação */}
      {activeTab === 'nova' && (
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* Data */}
            <div className="col-md-3">
              <label className="form-label">Data da Avaliação *</label>
              <input type="date" className="form-control" name="data_avaliacao"
                value={formData.data_avaliacao} onChange={handleChange} required />
            </div>
            <div className="col-md-3">
              <label className="form-label">Status *</label>
              <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
                <option value="APTO">Apto</option>
                <option value="APTO_COM_RESTRICAO">Apto com Restrição</option>
                <option value="INAPTO">Inapto</option>
              </select>
            </div>
          </div>

          {/* Dados Cardíacos */}
          <div className="card mt-4">
            <div className="card-header bg-danger text-white">
              <h5 className="mb-0"><FaHeartbeat className="me-2" /> Dados Cardíacos</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Batimentos em Repouso (bpm)</label>
                  <input type="number" className="form-control" name="batimentos_repouso"
                    value={formData.batimentos_repouso} onChange={handleChange} 
                    placeholder="Ex: 60" min="30" max="200" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Batimentos Pós-Esforço (bpm)</label>
                  <input type="number" className="form-control" name="batimentos_esforco"
                    value={formData.batimentos_esforco} onChange={handleChange}
                    placeholder="Ex: 150" min="60" max="220" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Pressão Arterial (mmHg)</label>
                  <input type="text" className="form-control" name="pressao_arterial"
                    value={formData.pressao_arterial} onChange={handleChange}
                    placeholder="Ex: 120/80" />
                </div>
              </div>
            </div>
          </div>

          {/* Composição Corporal */}
          <div className="card mt-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"><FaWeight className="me-2" /> Composição Corporal</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-2">
                  <label className="form-label">Peso (kg)</label>
                  <input type="number" step="0.1" className="form-control" name="peso"
                    value={formData.peso} onChange={handleChange}
                    placeholder="Ex: 75.5" min="30" max="200" />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Altura (m)</label>
                  <input type="number" step="0.01" className="form-control" name="altura"
                    value={formData.altura} onChange={handleChange}
                    placeholder="Ex: 1.78" min="1" max="2.5" />
                </div>
                <div className="col-md-2">
                  <label className="form-label">IMC (calculado)</label>
                  <input type="text" className="form-control" value={calcularIMC()} disabled />
                </div>
                <div className="col-md-3">
                  <label className="form-label">% Gordura Corporal</label>
                  <input type="number" step="0.1" className="form-control" name="percentual_gordura"
                    value={formData.percentual_gordura} onChange={handleChange}
                    placeholder="Ex: 12.5" min="3" max="50" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Massa Muscular (kg)</label>
                  <input type="number" step="0.1" className="form-control" name="massa_muscular"
                    value={formData.massa_muscular} onChange={handleChange}
                    placeholder="Ex: 35.0" min="10" max="100" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="card mt-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0"><FaRunning className="me-2" /> Indicadores de Performance</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">VO2 Máximo (ml/kg/min)</label>
                  <input type="number" step="0.1" className="form-control" name="vo2_max"
                    value={formData.vo2_max} onChange={handleChange}
                    placeholder="Ex: 55.0" min="20" max="90" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Flexibilidade</label>
                  <select className="form-select" name="flexibilidade" value={formData.flexibilidade} onChange={handleChange}>
                    <option value="">Selecione...</option>
                    <option value="Ruim">Ruim</option>
                    <option value="Regular">Regular</option>
                    <option value="Boa">Boa</option>
                    <option value="Excelente">Excelente</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Velocidade 10m (s)</label>
                  <input type="number" step="0.01" className="form-control" name="velocidade_10m"
                    value={formData.velocidade_10m} onChange={handleChange}
                    placeholder="Ex: 1.85" min="1" max="5" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Velocidade 40m (s)</label>
                  <input type="number" step="0.01" className="form-control" name="velocidade_40m"
                    value={formData.velocidade_40m} onChange={handleChange}
                    placeholder="Ex: 5.20" min="4" max="10" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Salto Vertical (cm)</label>
                  <input type="number" className="form-control" name="salto_vertical"
                    value={formData.salto_vertical} onChange={handleChange}
                    placeholder="Ex: 45" min="10" max="100" />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Resistência Abdominal (rep/min)</label>
                  <input type="number" className="form-control" name="resistencia_abdominal"
                    value={formData.resistencia_abdominal} onChange={handleChange}
                    placeholder="Ex: 40" min="0" max="100" />
                </div>
              </div>
            </div>
          </div>

          {/* Observações e Recomendações */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Observações</label>
                  <textarea className="form-control" rows="3" name="observacoes"
                    value={formData.observacoes} onChange={handleChange}
                    placeholder="Observações gerais sobre a avaliação..." />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Recomendações</label>
                  <textarea className="form-control" rows="3" name="recomendacoes"
                    value={formData.recomendacoes} onChange={handleChange}
                    placeholder="Recomendações para o atleta..." />
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-success btn-lg" disabled={saving}>
              <FaSave className="me-2" /> {saving ? 'Salvando...' : 'Salvar Avaliação'}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(`/atletas/${atletaId}`)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Histórico */}
      {activeTab === 'historico' && (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Peso</th>
                  <th>IMC</th>
                  <th>Bat. Repouso</th>
                  <th>VO2 Max</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {avaliacoes.map(av => (
                  <tr key={av.id}>
                    <td>{new Date(av.data_avaliacao).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <span className={`badge bg-${
                        av.status === 'APTO' ? 'success' : 
                        av.status === 'APTO_COM_RESTRICAO' ? 'warning' : 'danger'
                      }`}>
                        {av.status === 'APTO_COM_RESTRICAO' ? 'Apto c/ Restrição' : av.status}
                      </span>
                    </td>
                    <td>{av.peso ? `${av.peso}kg` : '-'}</td>
                    <td>{av.imc || '-'}</td>
                    <td>{av.batimentos_repouso ? `${av.batimentos_repouso} bpm` : '-'}</td>
                    <td>{av.vo2_max ? `${av.vo2_max}` : '-'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleGerarPDF(av)}
                        title="Gerar PDF"
                      >
                        <FaFilePdf className="me-1" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
                {avaliacoes.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Nenhuma avaliação registrada
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvaliacaoFisica;

