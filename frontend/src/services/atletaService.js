import api from './api';

export const atletaService = {
  listar: () => api.get('/atletas'),
  
  buscar: (id) => api.get(`/atletas/${id}`),
  
  criar: (dados) => api.post('/atletas', dados),
  
  atualizar: (id, dados) => api.put(`/atletas/${id}`, dados),
  
  excluir: (id) => api.delete(`/atletas/${id}`),
};



