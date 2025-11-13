# 🏥 Sistema de Gestão de Atletas - API

## 📋 Descrição
API RESTful desenvolvida em **Lumen** para gestão completa de atletas, incluindo controle de lesões, exames médicos, notificações e relatórios.

## 🚀 Funcionalidades
- ✅ **Autenticação JWT**
- ✅ **CRUD Completo de Atletas**
- ✅ **Gestão de Lesões** com regras de negócio
- ✅ **Controle de Exames Médicos**
- ✅ **Sistema de Notificações**
- ✅ **Relatórios de Disponibilidade**
- ✅ **Validações e Tratamento de Erros**

## 🛠️ Tecnologias
- **PHP Lumen 8.x**
- **MySQL**
- **Eloquent ORM**
- **JWT Authentication**
- **RESTful API**

## 📦 Instalação

### Pré-requisitos
- PHP 8.0+
- Composer
- MySQL

### Passos
```bash
# 1. Clonar repositório
git clone https://github.com/Mario-png2233/gestao-atletas-api.git
cd gestao-atletas-api

# 2. Instalar dependências
composer install

# 3. Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações de banco

# 4. Executar migrations
php artisan migrate

# 5. Iniciar servidor
php -S localhost:8000 -t public