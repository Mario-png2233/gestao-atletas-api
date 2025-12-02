import api from './api';

export const financaService = {
  // Resumo geral
  resumo: () => api.get('/financas/resumo'),

  // Patrocínios
  patrocinios: {
    listar: () => api.get('/patrocinios'),
    buscar: (id) => api.get(`/patrocinios/${id}`),
    criar: (dados) => api.post('/patrocinios', dados),
    atualizar: (id, dados) => api.put(`/patrocinios/${id}`, dados),
    excluir: (id) => api.delete(`/patrocinios/${id}`),
  },

  // Despesas
  despesas: {
    listar: () => api.get('/despesas'),
    buscar: (id) => api.get(`/despesas/${id}`),
    criar: (dados) => api.post('/despesas', dados),
    atualizar: (id, dados) => api.put(`/despesas/${id}`, dados),
    excluir: (id) => api.delete(`/despesas/${id}`),
  },

  // Receitas
  receitas: {
    listar: () => api.get('/receitas'),
    buscar: (id) => api.get(`/receitas/${id}`),
    criar: (dados) => api.post('/receitas', dados),
    atualizar: (id, dados) => api.put(`/receitas/${id}`, dados),
    excluir: (id) => api.delete(`/receitas/${id}`),
  },
};


