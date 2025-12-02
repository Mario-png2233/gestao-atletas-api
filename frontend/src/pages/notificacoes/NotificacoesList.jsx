import { useState, useEffect } from 'react';
import { notificacaoService } from '../../services/notificacaoService';
import { FaBell, FaCheck } from 'react-icons/fa';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';

const NotificacoesList = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadNotificacoes();
  }, []);

  const loadNotificacoes = async () => {
    try {
      const response = await notificacaoService.listar();
      setNotificacoes(response.data.data || []);
    } catch (error) {
      setToast({ message: 'Erro ao carregar notificações', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      await notificacaoService.marcarComoLida(id);
      setNotificacoes(notificacoes.map(n => 
        n.id === id ? { ...n, lida: true } : n
      ));
    } catch (error) {
      setToast({ message: 'Erro ao marcar como lida', type: 'error' });
    }
  };

  if (loading) return <Loading />;

  const naoLidas = notificacoes.filter(n => !n.lida);
  const lidas = notificacoes.filter(n => n.lida);

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="page-header">
        <h1 className="h3 mb-0">Notificações</h1>
        <p className="text-muted mb-0">
          {naoLidas.length} não lida{naoLidas.length !== 1 ? 's' : ''}
        </p>
      </div>

      {naoLidas.length > 0 && (
        <div className="mb-4">
          <h5 className="text-muted mb-3">Não lidas</h5>
          {naoLidas.map(notificacao => (
            <div key={notificacao.id} className="card mb-2 border-start border-primary border-4">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <div className="d-flex align-items-center mb-1">
                    <FaBell className="text-primary me-2" />
                    <strong>{notificacao.titulo}</strong>
                    <span className={`badge bg-${
                      notificacao.tipo === 'LESAO' ? 'danger' : 
                      notificacao.tipo === 'RECUPERACAO' ? 'success' : 'info'
                    } ms-2`}>
                      {notificacao.tipo}
                    </span>
                  </div>
                  <p className="mb-1">{notificacao.mensagem}</p>
                  <small className="text-muted">
                    {new Date(notificacao.created_at).toLocaleString('pt-BR')}
                  </small>
                </div>
                <button 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => marcarComoLida(notificacao.id)}
                >
                  <FaCheck className="me-1" /> Marcar como lida
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {lidas.length > 0 && (
        <div>
          <h5 className="text-muted mb-3">Lidas</h5>
          {lidas.map(notificacao => (
            <div key={notificacao.id} className="card mb-2 bg-light">
              <div className="card-body">
                <div className="d-flex align-items-center mb-1">
                  <FaBell className="text-muted me-2" />
                  <strong className="text-muted">{notificacao.titulo}</strong>
                </div>
                <p className="mb-1 text-muted">{notificacao.mensagem}</p>
                <small className="text-muted">
                  {new Date(notificacao.created_at).toLocaleString('pt-BR')}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}

      {notificacoes.length === 0 && (
        <div className="text-center py-5">
          <FaBell className="text-muted mb-3" style={{ fontSize: '3rem' }} />
          <p className="text-muted">Nenhuma notificação</p>
        </div>
      )}
    </div>
  );
};

export default NotificacoesList;


