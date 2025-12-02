import api from './api';

export const avaliacaoService = {
  // Listar todas as avaliações
  listar: () => api.get('/avaliacoes'),

  // Listar avaliações de um atleta
  listarPorAtleta: (atletaId) => api.get(`/atletas/${atletaId}/avaliacoes`),

  // Buscar uma avaliação
  buscar: (id) => api.get(`/avaliacoes/${id}`),

  // Buscar última avaliação de um atleta
  ultimaAvaliacao: (atletaId) => api.get(`/atletas/${atletaId}/avaliacoes/ultima`),

  // Criar avaliação
  criar: (atletaId, dados) => api.post(`/atletas/${atletaId}/avaliacoes`, dados),

  // Atualizar avaliação
  atualizar: (id, dados) => api.put(`/avaliacoes/${id}`, dados),

  // Excluir avaliação
  excluir: (id) => api.delete(`/avaliacoes/${id}`)
};

