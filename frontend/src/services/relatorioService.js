import api from './api';

export const relatorioService = {
  disponibilidade: (dataInicio, dataFim) => 
    api.get('/relatorios/disponibilidade', { 
      params: { data_inicio: dataInicio, data_fim: dataFim } 
    }),
};



