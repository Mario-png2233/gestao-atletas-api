import api from './api';

export const exameService = {
  listarTodos: () => api.get('/exames'),
  
  listarPorAtleta: (atletaId) => api.get(`/atletas/${atletaId}/exames`),
  
  buscar: (id) => api.get(`/exames/${id}`),
  
  criar: (atletaId, dados) => api.post(`/atletas/${atletaId}/exames`, dados),
  
  atualizar: (atletaId, exameId, dados) => api.put(`/atletas/${atletaId}/exames/${exameId}`, dados),
  
  excluir: (atletaId, exameId) => api.delete(`/atletas/${atletaId}/exames/${exameId}`),
};


