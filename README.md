# ⚽ Sistema de Gestão de Atletas

Sistema completo para gestão de clubes de futebol, com controle de atletas, lesões, exames médicos, táticas, finanças e calendário.

---

## 📋 Descrição

Aplicação web fullstack com:
- **Backend**: API RESTful em PHP/Lumen
- **Frontend**: Interface moderna em React + Vite + Bootstrap
- **Banco de Dados**: MySQL

---

## 🚀 Funcionalidades

### 👥 Perfis de Usuário
| Perfil | Acesso |
|--------|--------|
| **TÉCNICO** | Atletas, Táticas (campo visual), Treinos, Partidas, Calendário |
| **MÉDICO** | Atletas, Lesões, Exames Médicos, Calendário |
| **PREPARADOR** | Atletas, Avaliação Física + PDF, Treinos, Calendário |
| **DIRETOR FINANCEIRO** | Finanças, Patrocínios, Receitas, Despesas + PDF, Calendário |

### ⚙️ Recursos
- ✅ Autenticação com token
- ✅ CRUD completo de Atletas
- ✅ Gestão de Lesões com notificações
- ✅ Controle de Exames Médicos
- ✅ **Táticas com campo visual interativo** (arrastar jogadores)
- ✅ **Avaliação Física completa + geração de PDF**
- ✅ **Módulo Financeiro** (Patrocínios, Receitas, Despesas) + PDF
- ✅ **Calendário** com eventos e lembretes
- ✅ Sistema de Notificações
- ✅ Relatórios de Disponibilidade

---

## 🛠️ Tecnologias

### Backend
- PHP 8.0+
- Lumen Framework
- MySQL
- Eloquent ORM

### Frontend
- React 18
- Vite
- Bootstrap 5
- Axios
- jsPDF (geração de PDFs)
- React Router DOM

---

## 📦 Instalação

### Pré-requisitos
- [PHP 8.0+](https://www.php.net/downloads)
- [Composer](https://getcomposer.org/download/)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/)

---

## 🚀 Passo a Passo para Rodar o Projeto

### 1️⃣ Clonar o Repositório

```bash
git clone https://github.com/Mario-png2233/gestao-atletas-api.git
cd gestao-atletas-api
```

---

### 2️⃣ Configurar o Banco de Dados

1. Abra o **MySQL Workbench** (ou terminal MySQL)
2. Crie o banco de dados:

```sql
CREATE DATABASE gestao_atletas;
```

---

### 3️⃣ Configurar o Backend

```bash
# Instalar dependências do PHP
composer install

# Copiar arquivo de configuração
copy .env.example .env
```

Edite o arquivo `.env` com suas configurações do banco:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gestao_atletas
DB_USERNAME=root
DB_PASSWORD=sua_senha_aqui
```

```bash
# Criar as tabelas no banco
php artisan migrate
```

---

### 4️⃣ Configurar o Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências do Node.js
npm install

# Voltar para a pasta raiz
cd ..
```

---

### 5️⃣ Iniciar os Servidores

**Opção A — um único terminal (recomendado):**

```bash
# Na raiz do projeto (primeira vez: npm install)
npm install
npm run dev
```

**Opção B — dois terminais:**

**Terminal 1 - Backend (API):**
```bash
php -S localhost:8000 -t public
```

**Terminal 2 - Frontend (React):**
```bash
cd frontend
npm run dev
```

---

### 6️⃣ Acessar o Sistema

Abra o navegador e acesse:

```
http://localhost:3000
```

---

## 👤 Usuários de Demonstração

Se você executar os scripts de seed, terá estes usuários prontos:

| Email | Senha | Perfil |
|-------|-------|--------|
| tecnico@clubefc.com | 123456 | TÉCNICO |
| medico@clubefc.com | 123456 | MÉDICO |
| preparador@clubefc.com | 123456 | PREPARADOR |
| financeiro@clubefc.com | 123456 | DIRETOR FINANCEIRO |

Para criar usuários de teste, execute:
```bash
php seed_demo.php
php seed_complete.php
```

---

## 📁 Estrutura do Projeto

```
gestao-atletas-api/
├── app/
│   ├── Http/Controllers/    # Controladores da API
│   └── Models/              # Modelos do banco de dados
├── database/
│   └── migrations/          # Estrutura das tabelas
├── routes/
│   └── web.php              # Rotas da API
├── public/
│   └── index.php            # Ponto de entrada
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/           # Páginas do sistema
│   │   ├── services/        # Comunicação com API
│   │   └── context/         # Contextos React
│   └── package.json
├── .env                     # Configurações (não versionado)
└── README.md
```

---

## 🔌 Endpoints da API

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/register | Registrar usuário |
| POST | /api/login | Fazer login |
| GET | /api/me | Dados do usuário logado |

### Atletas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/atletas | Listar todos |
| GET | /api/atletas/{id} | Buscar um |
| POST | /api/atletas | Criar |
| PUT | /api/atletas/{id} | Atualizar |
| DELETE | /api/atletas/{id} | Excluir |

### Lesões, Exames, Treinos, Partidas
Seguem o mesmo padrão CRUD.

### Táticas (apenas TÉCNICO)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/taticas | Listar táticas |
| POST | /api/taticas | Criar tática |

### Finanças (apenas DIRETOR FINANCEIRO)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/financas/resumo | Resumo financeiro |
| GET | /api/patrocinios | Listar patrocínios |
| GET | /api/receitas | Listar receitas |
| GET | /api/despesas | Listar despesas |

---

## 🛠️ Comandos Úteis

```bash
# Resetar banco de dados (apaga tudo e recria)
php artisan migrate:fresh

# Ver rotas disponíveis
php artisan route:list

# Limpar cache
php artisan cache:clear
```

---

## 🐛 Problemas Comuns

### Erro de CORS
Verifique se o backend está rodando em `localhost:8000`.

### Erro ao conectar no banco
Verifique as credenciais no arquivo `.env`.

### Porta já em uso
Mate os processos que estão usando as portas:
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <numero_do_pid> /F
```

### Frontend não carrega
Certifique-se de ter instalado as dependências:
```bash
cd frontend
npm install
```

---

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

---

## 👨‍💻 Autor

Desenvolvido como projeto acadêmico.
