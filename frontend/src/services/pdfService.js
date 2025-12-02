import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Configurações do clube (pode ser customizado)
const CLUBE_NOME = 'Clube de Futebol';
const CLUBE_SUBTITULO = 'Sistema de Gestão de Atletas';

// Cores
const COR_PRIMARIA = [13, 110, 253]; // Azul Bootstrap
const COR_VERDE = [25, 135, 84];
const COR_VERMELHO = [220, 53, 69];

// ==================== PDF DE AVALIAÇÃO FÍSICA ====================
export const gerarPDFAvaliacaoFisica = (atleta, avaliacao, responsavel) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ===== CABEÇALHO =====
  doc.setFillColor(...COR_PRIMARIA);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(CLUBE_NOME, pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('FICHA DE AVALIAÇÃO FÍSICA', pageWidth / 2, 30, { align: 'center' });

  y = 55;

  // ===== DADOS DO ATLETA =====
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO ATLETA', 14, y);
  
  y += 5;
  doc.setDrawColor(...COR_PRIMARIA);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const dadosAtleta = [
    ['Nome:', atleta.nome || '-'],
    ['Posição:', atleta.posicao || '-'],
    ['Data de Nascimento:', atleta.data_nascimento ? new Date(atleta.data_nascimento).toLocaleDateString('pt-BR') : '-'],
    ['Altura:', atleta.altura ? `${atleta.altura}m` : '-'],
    ['Peso:', atleta.peso ? `${atleta.peso}kg` : '-'],
    ['Telefone:', atleta.telefone_contato || '-']
  ];

  dadosAtleta.forEach(([label, valor]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(valor, 60, y);
    y += 7;
  });

  y += 10;

  // ===== DADOS DA AVALIAÇÃO =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AVALIAÇÃO FÍSICA', 14, y);
  
  y += 5;
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data da Avaliação: ${avaliacao.data_avaliacao ? new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR') : '-'}`, 14, y);
  y += 10;

  // Tabela de dados cardíacos
  doc.autoTable({
    startY: y,
    head: [['DADOS CARDÍACOS', 'Valor']],
    body: [
      ['Batimentos em Repouso', avaliacao.batimentos_repouso ? `${avaliacao.batimentos_repouso} bpm` : '-'],
      ['Batimentos Pós-Esforço', avaliacao.batimentos_esforco ? `${avaliacao.batimentos_esforco} bpm` : '-'],
      ['Pressão Arterial', avaliacao.pressao_arterial || '-']
    ],
    theme: 'striped',
    headStyles: { fillColor: COR_PRIMARIA },
    margin: { left: 14, right: pageWidth / 2 + 5 },
    tableWidth: pageWidth / 2 - 20
  });

  // Tabela de composição corporal (ao lado)
  doc.autoTable({
    startY: y,
    head: [['COMPOSIÇÃO CORPORAL', 'Valor']],
    body: [
      ['Peso', avaliacao.peso ? `${avaliacao.peso} kg` : '-'],
      ['Altura', avaliacao.altura ? `${avaliacao.altura} m` : '-'],
      ['IMC', avaliacao.imc ? avaliacao.imc.toFixed(1) : '-'],
      ['% Gordura', avaliacao.percentual_gordura ? `${avaliacao.percentual_gordura}%` : '-'],
      ['Massa Muscular', avaliacao.massa_muscular ? `${avaliacao.massa_muscular} kg` : '-']
    ],
    theme: 'striped',
    headStyles: { fillColor: COR_VERDE },
    margin: { left: pageWidth / 2 + 5, right: 14 },
    tableWidth: pageWidth / 2 - 20
  });

  y = doc.lastAutoTable.finalY + 15;

  // Tabela de performance
  doc.autoTable({
    startY: y,
    head: [['INDICADORES DE PERFORMANCE', 'Valor']],
    body: [
      ['VO2 Máximo', avaliacao.vo2_max ? `${avaliacao.vo2_max} ml/kg/min` : '-'],
      ['Flexibilidade', avaliacao.flexibilidade || '-'],
      ['Velocidade 10m', avaliacao.velocidade_10m ? `${avaliacao.velocidade_10m}s` : '-'],
      ['Velocidade 40m', avaliacao.velocidade_40m ? `${avaliacao.velocidade_40m}s` : '-'],
      ['Salto Vertical', avaliacao.salto_vertical ? `${avaliacao.salto_vertical} cm` : '-'],
      ['Resistência Abdominal', avaliacao.resistencia_abdominal ? `${avaliacao.resistencia_abdominal} rep/min` : '-']
    ],
    theme: 'striped',
    headStyles: { fillColor: COR_PRIMARIA },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 15;

  // ===== RESULTADO =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESULTADO', 14, y);
  y += 5;
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  // Status com cor
  const statusCores = {
    'APTO': COR_VERDE,
    'APTO_COM_RESTRICAO': [255, 193, 7],
    'INAPTO': COR_VERMELHO
  };
  const statusLabels = {
    'APTO': 'APTO',
    'APTO_COM_RESTRICAO': 'APTO COM RESTRIÇÃO',
    'INAPTO': 'INAPTO'
  };

  const statusCor = statusCores[avaliacao.status] || COR_PRIMARIA;
  doc.setFillColor(...statusCor);
  doc.roundedRect(14, y - 5, 60, 12, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text(statusLabels[avaliacao.status] || avaliacao.status, 44, y + 2, { align: 'center' });

  y += 15;
  doc.setTextColor(0, 0, 0);

  // Observações
  if (avaliacao.observacoes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Observações:', 14, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    const obsLines = doc.splitTextToSize(avaliacao.observacoes, pageWidth - 28);
    doc.text(obsLines, 14, y);
    y += obsLines.length * 5 + 5;
  }

  // Recomendações
  if (avaliacao.recomendacoes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Recomendações:', 14, y);
    doc.setFont('helvetica', 'normal');
    y += 5;
    const recLines = doc.splitTextToSize(avaliacao.recomendacoes, pageWidth - 28);
    doc.text(recLines, 14, y);
    y += recLines.length * 5 + 5;
  }

  // ===== RODAPÉ =====
  y = 260;
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Responsável: ${responsavel || 'Não informado'}`, 14, y);
  doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - 14, y, { align: 'right' });

  y += 15;
  doc.text('_______________________________', 14, y);
  doc.text('_______________________________', pageWidth - 14, y, { align: 'right' });
  y += 5;
  doc.setFontSize(8);
  doc.text('Assinatura do Responsável', 14, y);
  doc.text('Assinatura do Atleta', pageWidth - 14, y, { align: 'right' });

  // Salvar
  doc.save(`avaliacao_fisica_${atleta.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};

// ==================== PDF DE RELATÓRIO FINANCEIRO ====================
export const gerarPDFRelatorioFinanceiro = (resumo, patrocinios, despesas, receitas) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ===== CABEÇALHO =====
  doc.setFillColor(...COR_PRIMARIA);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(CLUBE_NOME, pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('RELATÓRIO FINANCEIRO', pageWidth / 2, 30, { align: 'center' });

  y = 55;

  // Período
  const mesAtual = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.text(`Período: ${mesAtual}`, pageWidth / 2, y, { align: 'center' });

  y += 15;

  // ===== RESUMO DO MÊS =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO DO MÊS', 14, y);
  y += 5;
  doc.setDrawColor(...COR_PRIMARIA);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  const formatMoney = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  // Cards de resumo
  const cardWidth = (pageWidth - 42) / 3;
  
  // Receitas
  doc.setFillColor(...COR_VERDE);
  doc.roundedRect(14, y, cardWidth, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('RECEITAS', 14 + cardWidth/2, y + 8, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formatMoney(resumo?.mes_atual?.receitas), 14 + cardWidth/2, y + 18, { align: 'center' });

  // Despesas
  doc.setFillColor(...COR_VERMELHO);
  doc.roundedRect(14 + cardWidth + 7, y, cardWidth, 25, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('DESPESAS', 14 + cardWidth + 7 + cardWidth/2, y + 8, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formatMoney(resumo?.mes_atual?.despesas), 14 + cardWidth + 7 + cardWidth/2, y + 18, { align: 'center' });

  // Saldo
  const saldo = resumo?.mes_atual?.saldo || 0;
  doc.setFillColor(...(saldo >= 0 ? COR_PRIMARIA : [255, 193, 7]));
  doc.roundedRect(14 + (cardWidth + 7) * 2, y, cardWidth, 25, 3, 3, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('SALDO', 14 + (cardWidth + 7) * 2 + cardWidth/2, y + 8, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(formatMoney(saldo), 14 + (cardWidth + 7) * 2 + cardWidth/2, y + 18, { align: 'center' });

  y += 40;

  // ===== RECEITAS DETALHADAS =====
  if (receitas && receitas.length > 0) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('RECEITAS DETALHADAS', 14, y);
    y += 8;

    doc.autoTable({
      startY: y,
      head: [['Descrição', 'Categoria', 'Data', 'Valor']],
      body: receitas.slice(0, 10).map(r => [
        r.descricao,
        r.categoria,
        new Date(r.data).toLocaleDateString('pt-BR'),
        formatMoney(r.valor)
      ]),
      theme: 'striped',
      headStyles: { fillColor: COR_VERDE },
      margin: { left: 14, right: 14 }
    });

    y = doc.lastAutoTable.finalY + 15;
  }

  // ===== DESPESAS DETALHADAS =====
  if (despesas && despesas.length > 0) {
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('DESPESAS DETALHADAS', 14, y);
    y += 8;

    doc.autoTable({
      startY: y,
      head: [['Descrição', 'Categoria', 'Status', 'Valor']],
      body: despesas.slice(0, 10).map(d => [
        d.descricao,
        d.categoria,
        d.status,
        formatMoney(d.valor)
      ]),
      theme: 'striped',
      headStyles: { fillColor: COR_VERMELHO },
      margin: { left: 14, right: 14 }
    });

    y = doc.lastAutoTable.finalY + 15;
  }

  // ===== PATROCÍNIOS =====
  if (patrocinios && patrocinios.length > 0) {
    // Nova página se necessário
    if (y > 220) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PATROCÍNIOS ATIVOS', 14, y);
    y += 8;

    doc.autoTable({
      startY: y,
      head: [['Empresa', 'Tipo', 'Vigência', 'Valor Contrato']],
      body: patrocinios.filter(p => p.status === 'ATIVO').map(p => [
        p.empresa,
        p.tipo,
        `${new Date(p.data_inicio).toLocaleDateString('pt-BR')} a ${new Date(p.data_fim).toLocaleDateString('pt-BR')}`,
        formatMoney(p.valor_contrato)
      ]),
      theme: 'striped',
      headStyles: { fillColor: COR_PRIMARIA },
      margin: { left: 14, right: 14 }
    });

    y = doc.lastAutoTable.finalY + 15;
  }

  // ===== RESUMO ANUAL =====
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMO ANUAL', 14, y);
  y += 8;

  doc.autoTable({
    startY: y,
    head: [['', 'Valor']],
    body: [
      ['Total de Receitas', formatMoney(resumo?.ano_atual?.receitas)],
      ['Total de Despesas', formatMoney(resumo?.ano_atual?.despesas)],
      ['Saldo Anual', formatMoney(resumo?.ano_atual?.saldo)]
    ],
    theme: 'grid',
    headStyles: { fillColor: COR_PRIMARIA },
    margin: { left: 14, right: 14 },
    tableWidth: 100
  });

  // ===== RODAPÉ =====
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `${CLUBE_SUBTITULO} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
  }

  // Salvar
  doc.save(`relatorio_financeiro_${new Date().toISOString().split('T')[0]}.pdf`);
};

export default {
  gerarPDFAvaliacaoFisica,
  gerarPDFRelatorioFinanceiro
};



