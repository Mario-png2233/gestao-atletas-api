import { useState } from 'react';
import { relatorioService } from '../../services/relatorioService';
import { FaChartBar, FaSearch } from 'react-icons/fa';
import Toast from '../../components/common/Toast';

const Relatorios = () => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!dataInicio || !dataFim) {
      setToast({ message: 'Selecione as datas', type: 'warning' });
      return;
    }

    setLoading(true);
    try {
      const response = await relatorioService.disponibilidade(dataInicio, dataFim);
      setRelatorio(response.data.data);
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Erro ao gerar relatório', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="h3 mb-0">Relatórios</h1>
        <p className="text-muted mb-0">Análise de disponibilidade dos atletas</p>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleBuscar}>
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Data Início</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Data Fim</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" />
                  ) : (
                    <FaSearch className="me-2" />
                  )}
                  Gerar Relatório
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Resultado */}
      {relatorio && (
        <div className="row g-4">
          {/* Cards de Estatísticas */}
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h2 className="display-4 fw-bold">{relatorio.estatisticas.total_atletas}</h2>
                <p className="mb-0">Total de Atletas</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h2 className="display-4 fw-bold">{relatorio.estatisticas.disponiveis}</h2>
                <p className="mb-0">Disponíveis</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-danger text-white">
              <div className="card-body text-center">
                <h2 className="display-4 fw-bold">{relatorio.estatisticas.lesionados}</h2>
                <p className="mb-0">Lesionados</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-dark">
              <div className="card-body text-center">
                <h2 className="display-4 fw-bold">{relatorio.estatisticas.suspensos}</h2>
                <p className="mb-0">Suspensos</p>
              </div>
            </div>
          </div>

          {/* Percentual de Disponibilidade */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Taxa de Disponibilidade</h5>
              </div>
              <div className="card-body text-center">
                <div className="display-1 fw-bold text-success">
                  {relatorio.estatisticas.porcentagem_disponivel}%
                </div>
                <p className="text-muted">dos atletas estão disponíveis</p>
                <div className="progress" style={{ height: '30px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${relatorio.estatisticas.porcentagem_disponivel}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lesões por Gravidade */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Lesões no Período ({relatorio.lesoes_periodo})</h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-around text-center">
                  <div>
                    <div className="display-6 fw-bold text-success">{relatorio.lesoes_por_gravidade.LEVE}</div>
                    <small className="text-muted">Leves</small>
                  </div>
                  <div>
                    <div className="display-6 fw-bold text-warning">{relatorio.lesoes_por_gravidade.MODERADA}</div>
                    <small className="text-muted">Moderadas</small>
                  </div>
                  <div>
                    <div className="display-6 fw-bold text-danger">{relatorio.lesoes_por_gravidade.GRAVE}</div>
                    <small className="text-muted">Graves</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Período */}
          <div className="col-12">
            <div className="alert alert-info">
              <FaChartBar className="me-2" />
              Período analisado: {new Date(relatorio.periodo.inicio).toLocaleDateString('pt-BR')} até {new Date(relatorio.periodo.fim).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      )}

      {!relatorio && (
        <div className="text-center py-5">
          <FaChartBar className="text-muted mb-3" style={{ fontSize: '4rem' }} />
          <p className="text-muted">Selecione um período para gerar o relatório</p>
        </div>
      )}
    </div>
  );
};

export default Relatorios;



