import api from './api';

export const treinoService = {
  listar: () => api.get('/treinos'),
  
  buscar: (id) => api.get(`/treinos/${id}`),
  
  criar: (dados) => api.post('/treinos', dados),
  
  atualizar: (id, dados) => api.put(`/treinos/${id}`, dados),
  
  excluir: (id) => api.delete(`/treinos/${id}`),
  
  vincularAtletas: (id, atletas) => api.post(`/treinos/${id}/atletas`, { atletas }),
  
  registrarPresenca: (id, presencas) => api.put(`/treinos/${id}/presenca`, { presencas }),
};



