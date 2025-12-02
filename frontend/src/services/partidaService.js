import api from './api';

export const partidaService = {
  listar: () => api.get('/partidas'),
  
  buscar: (id) => api.get(`/partidas/${id}`),
  
  criar: (dados) => api.post('/partidas', dados),
  
  atualizar: (id, dados) => api.put(`/partidas/${id}`, dados),
  
  excluir: (id) => api.delete(`/partidas/${id}`),
};



