import api from './api';

export const lesaoService = {
  listarTodas: () => api.get('/lesoes'),
  
  listarPorAtleta: (atletaId) => api.get(`/atletas/${atletaId}/lesoes`),
  
  buscar: (id) => api.get(`/lesoes/${id}`),
  
  criar: (atletaId, dados) => api.post(`/atletas/${atletaId}/lesoes`, dados),
  
  atualizar: (atletaId, lesaoId, dados) => api.put(`/atletas/${atletaId}/lesoes/${lesaoId}`, dados),
  
  excluir: (atletaId, lesaoId) => api.delete(`/atletas/${atletaId}/lesoes/${lesaoId}`),
};



