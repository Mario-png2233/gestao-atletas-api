import api from './api';

export const taticaService = {
  listar: () => api.get('/taticas'),
  
  buscar: (id) => api.get(`/taticas/${id}`),
  
  criar: (dados) => api.post('/taticas', dados),
  
  atualizar: (id, dados) => api.put(`/taticas/${id}`, dados),
  
  excluir: (id) => api.delete(`/taticas/${id}`),
};



