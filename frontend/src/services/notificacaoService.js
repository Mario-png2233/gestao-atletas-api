import api from './api';

export const notificacaoService = {
  listar: () => api.get('/notificacoes'),
  
  marcarComoLida: (id) => api.put(`/notificacoes/${id}/lida`),
  
  contarNaoLidas: () => api.get('/notificacoes/nao-lidas/count'),
};



