# Manual do Usuário
## Sistema de Gerenciamento de Atletas

**Disciplina:** Projeto de Software 2  
**Versão:** 1.0

---

## Sumário

1. [Introdução](#1-introdução)
2. [Requisitos do Sistema](#2-requisitos-do-sistema)
3. [Acesso ao Sistema](#3-acesso-ao-sistema)
4. [Perfis de Usuário](#4-perfis-de-usuário)
5. [Funcionalidades Gerais](#5-funcionalidades-gerais)
6. [Módulo de Atletas](#6-módulo-de-atletas)
7. [Módulo de Lesões](#7-módulo-de-lesões)
8. [Módulo de Exames](#8-módulo-de-exames)
9. [Módulo de Partidas](#9-módulo-de-partidas)
10. [Módulo de Treinos](#10-módulo-de-treinos)
11. [Módulo de Calendário](#11-módulo-de-calendário)
12. [Módulo de Táticas (Técnico)](#12-módulo-de-táticas-técnico)
13. [Módulo de Finanças (Diretor Financeiro)](#13-módulo-de-finanças-diretor-financeiro)
14. [Módulo de Avaliação Física (Médico/Preparador)](#14-módulo-de-avaliação-física-médicopreparador)
15. [Relatórios e Exportação PDF](#15-relatórios-e-exportação-pdf)
16. [Notificações](#16-notificações)

---

## 1. Introdução

O **Sistema de Gerenciamento de Atletas** é uma aplicação web desenvolvida para auxiliar clubes esportivos no gerenciamento completo de seus atletas, incluindo controle de lesões, exames médicos, partidas, treinos, táticas e finanças.

O sistema foi desenvolvido utilizando:
- **Backend:** PHP com framework Lumen
- **Frontend:** React com Vite
- **Banco de Dados:** MySQL

---

## 2. Requisitos do Sistema

Para acessar o sistema, você precisa de:
- Navegador web atualizado (Chrome, Firefox, Edge ou Safari)
- Conexão com a internet
- Credenciais de acesso (email e senha)

---

## 3. Acesso ao Sistema

### 3.1 Tela de Login

Ao acessar o sistema, você verá a tela de login com os seguintes campos:

| Campo | Descrição |
|-------|-----------|
| **Email** | Seu endereço de email cadastrado |
| **Senha** | Sua senha (mínimo 6 caracteres) |

### 3.2 Como fazer Login

1. Digite seu **email** no campo correspondente
2. Digite sua **senha**
3. Clique no botão **"Entrar"**
4. Aguarde o redirecionamento para o Dashboard

### 3.3 Como criar uma nova conta

1. Na tela de login, clique em **"Criar nova conta"**
2. Preencha o **email** desejado
3. Crie uma **senha** (mínimo 6 caracteres)
4. Selecione seu **perfil**:
   - Técnico
   - Médico
   - Preparador Físico
   - Diretor Financeiro
5. Clique em **"Cadastrar"**

### 3.4 Como sair do sistema

1. No canto superior direito, clique no seu email
2. Clique em **"Sair"**

---

## 4. Perfis de Usuário

O sistema possui 4 tipos de perfis, cada um com funcionalidades específicas:

| Perfil | Acesso Especial |
|--------|-----------------|
| **Técnico** | Módulo de Táticas |
| **Médico** | Avaliação Física dos atletas |
| **Preparador Físico** | Avaliação Física dos atletas |
| **Diretor Financeiro** | Módulo de Finanças |

**Observação:** Todos os perfis têm acesso às funcionalidades gerais (Atletas, Lesões, Exames, Partidas, Treinos, Calendário, Relatórios e Notificações).

---

## 5. Funcionalidades Gerais

### 5.1 Dashboard

O Dashboard é a tela inicial do sistema e apresenta:

- **Cards de Estatísticas:**
  - Total de Atletas
  - Atletas Disponíveis
  - Atletas Lesionados
  - Atletas Suspensos

- **Tabelas de Resumo:**
  - Atletas Recentes (últimos 5 cadastrados)
  - Lesões Ativas (últimas 5 lesões em tratamento)

### 5.2 Menu Lateral (Sidebar)

O menu lateral mostra todas as opções disponíveis de acordo com seu perfil:

- 🏠 Dashboard
- 👥 Atletas
- ❤️ Lesões
- 🩺 Exames
- ⚽ Partidas
- 🏃 Treinos
- 📅 Calendário
- ♟️ Táticas (apenas Técnico)
- 💰 Finanças (apenas Diretor Financeiro)
- 📊 Relatórios
- 🔔 Notificações

---

## 6. Módulo de Atletas

### 6.1 Listar Atletas

1. No menu lateral, clique em **"Atletas"**
2. Visualize a lista de todos os atletas cadastrados
3. Use o campo de busca para filtrar por nome
4. Use o filtro de status para filtrar por situação (Disponível, Lesionado, Suspenso)

### 6.2 Cadastrar Novo Atleta

1. Clique no botão **"Novo Atleta"**
2. Preencha os campos obrigatórios:
   - **Nome completo**
   - **Data de nascimento**
   - **Posição** (Goleiro, Zagueiro, Lateral, Volante, Meia, Atacante)
   - **Número da camisa**
3. Clique em **"Salvar"**

### 6.3 Visualizar Detalhes do Atleta

1. Na lista de atletas, clique no **nome** do atleta
2. Visualize todas as informações do atleta:
   - Dados pessoais
   - Histórico de lesões
   - Exames realizados
   - Avaliações físicas

### 6.4 Editar Atleta

1. Na página de detalhes do atleta, clique em **"Editar"**
2. Modifique os campos desejados
3. Clique em **"Salvar"**

### 6.5 Excluir Atleta

1. Na lista de atletas, clique no ícone de **lixeira** ao lado do atleta
2. Confirme a exclusão

---

## 7. Módulo de Lesões

### 7.1 Listar Lesões

1. No menu lateral, clique em **"Lesões"**
2. Visualize todas as lesões registradas
3. Filtre por status: Ativa, Recuperado

### 7.2 Registrar Nova Lesão

1. Acesse a página de detalhes de um atleta
2. Clique em **"Nova Lesão"**
3. Preencha os campos:
   - **Tipo de lesão** (muscular, articular, óssea, etc.)
   - **Região afetada**
   - **Gravidade** (Leve, Moderada, Grave)
   - **Data da lesão**
   - **Descrição** (opcional)
4. Clique em **"Salvar"**

### 7.3 Atualizar Status da Lesão

1. Na lista de lesões, clique na lesão desejada
2. Altere o status para **"Recuperado"** quando o atleta estiver apto
3. Clique em **"Salvar"**

---

## 8. Módulo de Exames

### 8.1 Listar Exames

1. No menu lateral, clique em **"Exames"**
2. Visualize todos os exames cadastrados

### 8.2 Cadastrar Novo Exame

1. Acesse a página de detalhes de um atleta
2. Clique em **"Novo Exame"**
3. Preencha os campos:
   - **Tipo de exame** (sangue, imagem, cardíaco, etc.)
   - **Data do exame**
   - **Resultado**
   - **Observações** (opcional)
4. Clique em **"Salvar"**

---

## 9. Módulo de Partidas

### 9.1 Listar Partidas

1. No menu lateral, clique em **"Partidas"**
2. Visualize todas as partidas agendadas

### 9.2 Cadastrar Nova Partida

1. Clique em **"Nova Partida"**
2. Preencha os campos:
   - **Adversário**
   - **Data e hora**
   - **Local** (Casa ou Fora)
   - **Competição**
3. Clique em **"Salvar"**

---

## 10. Módulo de Treinos

### 10.1 Listar Treinos

1. No menu lateral, clique em **"Treinos"**
2. Visualize todos os treinos cadastrados

### 10.2 Cadastrar Novo Treino

1. Clique em **"Novo Treino"**
2. Preencha os campos:
   - **Tipo de treino** (tático, físico, técnico)
   - **Data e hora**
   - **Duração**
   - **Descrição** (opcional)
3. Clique em **"Salvar"**

---

## 11. Módulo de Calendário

O calendário permite visualizar e gerenciar eventos importantes.

### 11.1 Visualizar Calendário

1. No menu lateral, clique em **"Calendário"**
2. Visualize os eventos do mês atual
3. Use as setas para navegar entre os meses

### 11.2 Adicionar Novo Evento

1. Clique no botão **"Novo Evento"**
2. Preencha os campos:
   - **Título** do evento
   - **Tipo** (Jogo, Treino, Exame, Reunião)
   - **Data e hora**
   - **Descrição** (opcional)
3. Clique em **"Salvar"**

### 11.3 Tipos de Eventos

| Tipo | Cor | Descrição |
|------|-----|-----------|
| Jogo | Azul | Partidas oficiais |
| Treino | Verde | Sessões de treino |
| Exame | Laranja | Exames médicos |
| Reunião | Roxo | Reuniões da equipe |

---

## 12. Módulo de Táticas (Técnico)

**Acesso exclusivo:** Perfil Técnico

### 12.1 Acessar Táticas

1. No menu lateral, clique em **"Táticas"**
2. Visualize a lista de táticas criadas

### 12.2 Criar Nova Tática

1. Clique em **"Nova Tática"**
2. Preencha os campos:
   - **Nome da tática**
   - **Formação** (4-3-3, 4-4-2, 3-5-2, etc.)
   - **Descrição geral**
   - **Instruções de ataque**
   - **Instruções de defesa**
   - **Jogadas ensaiadas** (opcional)
3. Clique em **"Salvar"**

### 12.3 Campo Tático Visual

O sistema oferece um campo tático interativo onde você pode:
- Visualizar a formação escolhida
- Ver as posições dos jogadores no campo
- Arrastar jogadores para diferentes posições (se habilitado)

### 12.4 Ativar/Desativar Tática

- Marque uma tática como **"Ativa"** para indicar que é a tática atual do time
- Apenas uma tática pode estar ativa por vez

---

## 13. Módulo de Finanças (Diretor Financeiro)

**Acesso exclusivo:** Perfil Diretor Financeiro

### 13.1 Dashboard Financeiro

Ao acessar **"Finanças"** no menu lateral, você verá:
- **Resumo geral:**
  - Total de receitas
  - Total de despesas
  - Saldo atual
  - Total de patrocínios ativos

### 13.2 Gerenciar Patrocínios

1. Clique em **"Patrocínios"**
2. Visualize a lista de patrocinadores
3. Para adicionar novo patrocínio, clique em **"Novo Patrocínio"** e preencha:
   - **Nome da empresa**
   - **Valor do contrato**
   - **Data de início**
   - **Data de término**
   - **Status** (Ativo, Encerrado, Em negociação)

### 13.3 Gerenciar Despesas

1. Clique em **"Despesas"**
2. Visualize a lista de despesas
3. Para adicionar nova despesa, clique em **"Nova Despesa"** e preencha:
   - **Descrição**
   - **Categoria** (Salários, Equipamentos, Transporte, etc.)
   - **Valor**
   - **Data**

### 13.4 Gerenciar Receitas

1. Clique em **"Receitas"**
2. Visualize a lista de receitas
3. Para adicionar nova receita, clique em **"Nova Receita"** e preencha:
   - **Descrição**
   - **Fonte** (Bilheteria, Patrocínio, Vendas, etc.)
   - **Valor**
   - **Data**

---

## 14. Módulo de Avaliação Física (Médico/Preparador)

**Acesso exclusivo:** Perfis Médico e Preparador Físico

### 14.1 Acessar Avaliação Física

1. Vá para a página de detalhes de um atleta
2. Clique no botão **"Avaliação Física"**

### 14.2 Registrar Avaliação

Preencha os dados da avaliação:
- **Peso** (kg)
- **Altura** (cm)
- **Percentual de gordura**
- **Frequência cardíaca em repouso** (BPM)
- **Pressão arterial**
- **VO2 máximo** (opcional)
- **Flexibilidade** (opcional)
- **Observações**

### 14.3 Gerar PDF da Avaliação

Após salvar a avaliação, clique em **"Exportar PDF"** para gerar um relatório completo com todos os dados de saúde do atleta.

---

## 15. Relatórios e Exportação PDF

### 15.1 Acessar Relatórios

1. No menu lateral, clique em **"Relatórios"**
2. Visualize as opções de relatórios disponíveis

### 15.2 Tipos de Relatórios

| Relatório | Descrição |
|-----------|-----------|
| Atletas | Lista completa de atletas com status |
| Lesões | Histórico de lesões do elenco |
| Exames | Exames realizados por período |
| Financeiro* | Resumo de receitas e despesas |

*Disponível apenas para Diretor Financeiro

### 15.3 Exportar para PDF

1. Selecione o relatório desejado
2. Clique no botão **"Exportar PDF"**
3. O arquivo será baixado automaticamente

---

## 16. Notificações

### 16.1 Acessar Notificações

1. Clique no ícone de **sino** no canto superior direito, ou
2. No menu lateral, clique em **"Notificações"**

### 16.2 Tipos de Notificações

O sistema envia notificações automáticas para:
- Lesões registradas
- Exames agendados
- Partidas próximas
- Atletas prestes a retornar de lesão

---

## Resumo de Atalhos por Perfil

| Perfil | Menu Especial | Funcionalidade Exclusiva |
|--------|---------------|--------------------------|
| Técnico | Táticas | Criar formações e estratégias |
| Médico | - | Avaliação Física + PDF Saúde |
| Preparador | - | Avaliação Física + PDF Saúde |
| Diretor Financeiro | Finanças | Patrocínios, Receitas, Despesas, PDF Financeiro |

---

## Suporte

Em caso de dúvidas ou problemas técnicos, entre em contato com o administrador do sistema.

---

**Documento criado para a disciplina Projeto de Software 2**

