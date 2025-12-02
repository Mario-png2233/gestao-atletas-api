import api from './api';

export const eventoService = {
  listar: (params) => api.get('/eventos', { params }),
  
  calendario: (mes, ano) => api.get('/eventos/calendario', { params: { mes, ano } }),
  
  buscar: (id) => api.get(`/eventos/${id}`),
  
  criar: (dados) => api.post('/eventos', dados),
  
  atualizar: (id, dados) => api.put(`/eventos/${id}`, dados),
  
  excluir: (id) => api.delete(`/eventos/${id}`),
};

