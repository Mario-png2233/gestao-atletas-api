import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { financaService } from '../../services/financaService';
import { gerarPDFRelatorioFinanceiro } from '../../services/pdfService';
import { FaDollarSign, FaArrowUp, FaArrowDown, FaHandshake, FaExclamationTriangle, FaFilePdf } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const FinancasDashboard = () => {
  const [resumo, setResumo] = useState(null);
  const [patrocinios, setPatrocinios] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resumoRes, patrociniosRes, despesasRes, receitasRes] = await Promise.all([
        financaService.resumo(),
        financaService.patrocinios.listar(),
        financaService.despesas.listar(),
        financaService.receitas.listar()
      ]);
      setResumo(resumoRes.data.data);
      setPatrocinios(patrociniosRes.data.data || []);
      setDespesas(despesasRes.data.data || []);
      setReceitas(receitasRes.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar dados financeiros', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
  };

  const handleGerarPDF = () => {
    setGerando(true);
    try {
      gerarPDFRelatorioFinanceiro(resumo, patrocinios, despesas, receitas);
      setToast({ message: 'Relatório PDF gerado com sucesso!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Erro ao gerar PDF', type: 'error' });
    } finally {
      setGerando(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 mb-0"><FaDollarSign className="me-2" />Finanças</h1>
          <p className="text-muted mb-0">Visão geral financeira do clube</p>
        </div>
        <button 
          className="btn btn-danger btn-lg" 
          onClick={handleGerarPDF}
          disabled={gerando}
        >
          <FaFilePdf className="me-2" />
          {gerando ? 'Gerando...' : 'Exportar Relatório PDF'}
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Receitas (Mês)</h6>
                  <h3 className="mb-0">{formatCurrency(resumo?.mes_atual?.receitas)}</h3>
                </div>
                <FaArrowUp style={{ fontSize: '2rem', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Despesas (Mês)</h6>
                  <h3 className="mb-0">{formatCurrency(resumo?.mes_atual?.despesas)}</h3>
                </div>
                <FaArrowDown style={{ fontSize: '2rem', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className={`card ${(resumo?.mes_atual?.saldo || 0) >= 0 ? 'bg-primary' : 'bg-warning'} text-white`}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Saldo (Mês)</h6>
                  <h3 className="mb-0">{formatCurrency(resumo?.mes_atual?.saldo)}</h3>
                </div>
                <FaDollarSign style={{ fontSize: '2rem', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">Patrocínios Ativos</h6>
                  <h3 className="mb-0">{resumo?.patrocinios?.ativos || 0}</h3>
                </div>
                <FaHandshake style={{ fontSize: '2rem', opacity: 0.5 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pendências */}
      {(resumo?.pendencias?.despesas_pendentes > 0 || resumo?.pendencias?.despesas_atrasadas > 0) && (
        <div className="alert alert-warning d-flex align-items-center mb-4">
          <FaExclamationTriangle className="me-2" />
          <div>
            <strong>Atenção:</strong> Você tem {formatCurrency(resumo?.pendencias?.despesas_pendentes)} em despesas pendentes
            {resumo?.pendencias?.despesas_atrasadas > 0 && ` e ${formatCurrency(resumo?.pendencias?.despesas_atrasadas)} em despesas atrasadas`}.
          </div>
        </div>
      )}

      <div className="row g-4">
        {/* Ano Atual */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Resumo do Ano</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <h4 className="text-success">{formatCurrency(resumo?.ano_atual?.receitas)}</h4>
                  <small className="text-muted">Receitas</small>
                </div>
                <div className="col-4">
                  <h4 className="text-danger">{formatCurrency(resumo?.ano_atual?.despesas)}</h4>
                  <small className="text-muted">Despesas</small>
                </div>
                <div className="col-4">
                  <h4 className={resumo?.ano_atual?.saldo >= 0 ? 'text-primary' : 'text-warning'}>
                    {formatCurrency(resumo?.ano_atual?.saldo)}
                  </h4>
                  <small className="text-muted">Saldo</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patrocínios */}
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Patrocínios</h5>
              <Link to="/financas/patrocinios" className="btn btn-sm btn-primary">Ver todos</Link>
            </div>
            <div className="card-body">
              <div className="text-center">
                <h2 className="text-info">{formatCurrency(resumo?.patrocinios?.valor_total)}</h2>
                <p className="text-muted mb-0">Valor total em contratos ativos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Últimas Transações */}
      <div className="row g-4 mt-2">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-success">Últimas Receitas</h5>
              <Link to="/financas/receitas" className="btn btn-sm btn-outline-success">Ver todas</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-sm mb-0">
                <tbody>
                  {receitas.slice(0, 5).map(r => (
                    <tr key={r.id}>
                      <td>{r.descricao}</td>
                      <td className="text-end text-success fw-bold">{formatCurrency(r.valor)}</td>
                    </tr>
                  ))}
                  {receitas.length === 0 && (
                    <tr><td colSpan="2" className="text-center text-muted py-3">Nenhuma receita</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-danger">Últimas Despesas</h5>
              <Link to="/financas/despesas" className="btn btn-sm btn-outline-danger">Ver todas</Link>
            </div>
            <div className="card-body p-0">
              <table className="table table-sm mb-0">
                <tbody>
                  {despesas.slice(0, 5).map(d => (
                    <tr key={d.id}>
                      <td>{d.descricao}</td>
                      <td className="text-end text-danger fw-bold">{formatCurrency(d.valor)}</td>
                    </tr>
                  ))}
                  {despesas.length === 0 && (
                    <tr><td colSpan="2" className="text-center text-muted py-3">Nenhuma despesa</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Links Rápidos */}
      <div className="row g-4 mt-2">
        <div className="col-md-4">
          <Link to="/financas/patrocinios" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <FaHandshake className="text-info mb-2" style={{ fontSize: '2.5rem' }} />
              <h5>Patrocínios</h5>
              <p className="text-muted mb-0">Gerenciar patrocinadores</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/financas/receitas" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <FaArrowUp className="text-success mb-2" style={{ fontSize: '2.5rem' }} />
              <h5>Receitas</h5>
              <p className="text-muted mb-0">Entradas de dinheiro</p>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/financas/despesas" className="card text-decoration-none h-100">
            <div className="card-body text-center">
              <FaArrowDown className="text-danger mb-2" style={{ fontSize: '2.5rem' }} />
              <h5>Despesas</h5>
              <p className="text-muted mb-0">Saídas e pagamentos</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FinancasDashboard;
