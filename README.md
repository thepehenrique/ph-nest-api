# PH Nest API

> Projeto de estudos desenvolvido para explorar o ecossistema do **NestJS**, implementando recursos e tecnologias utilizadas em aplicações reais de mercado.

## 📌 Objetivo

O **PH Nest API** foi criado com o objetivo de reunir, em um único projeto, as principais funcionalidades e tecnologias utilizadas no desenvolvimento de APIs modernas com NestJS.

O foco não é apenas implementar funcionalidades, mas entender quando, por que e como utilizar cada tecnologia de forma organizada, seguindo boas práticas de arquitetura e desenvolvimento.

---

## 🚀 Tecnologias

### Base

* NestJS
* TypeScript
* PostgreSQL (Supabase)
* TypeORM
* Docker
* Swagger (OpenAPI)

### Autenticação

* JWT
* Passport
* Bcrypt

### Validação

* class-validator
* class-transformer

### Futuras implementações

* Redis
* BullMQ
* Kafka
* Cron Jobs
* Upload de Arquivos
* Sistema de Notificações
* Envio de E-mails
* WebSocket
* Cache
* Logging
* Health Check
* Testes Unitários
* Testes E2E

---

## 🏗 Arquitetura

O projeto segue uma arquitetura modular baseada no padrão recomendado pelo NestJS.

```text
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
TypeORM
      │
      ▼
PostgreSQL
```

Cada camada possui uma responsabilidade bem definida:

* **Controller** → Recebe as requisições HTTP.
* **Service** → Contém as regras de negócio.
* **Repository** → Responsável pelo acesso aos dados.
* **Database** → Persistência das informações.

---

## 📂 Estrutura do Projeto

```text
src/
│
├── common/
│   ├── constants/
│   ├── decorators/
│   ├── enums/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── interfaces/
│   ├── pipes/
│   └── utils/
│
├── config/
│
├── database/
│
├── modules/
│   ├── auth/
│   ├── users/
│   └── mail/
│
├── shared/
│
├── app.module.ts
└── main.ts
```

Cada módulo é responsável por encapsular sua própria lógica de negócio.

---

## 📌 Funcionalidades

### Primeira versão

* Cadastro de usuários
* Login com e-mail e senha
* Recuperação de senha por e-mail

### Próximas funcionalidades

* Upload de arquivos
* Filas com BullMQ
* Eventos com Kafka
* Agendamentos com Cron
* Sistema de notificações
* Cache com Redis
* WebSockets
* Health Check
* Logs estruturados

---

## 🗄 Modelagem inicial

### users

Responsável pelo cadastro dos usuários do sistema.

Campos principais:

* id
* name
* email
* password
* is_active
* created_at
* updated_at

### password_reset_tokens

Responsável pelo gerenciamento dos tokens de recuperação de senha.

Campos principais:

* id
* user_id
* token
* expires_at
* used_at
* created_at

---

## 📖 Documentação

A documentação da API será disponibilizada através do Swagger.

```text
http://localhost:3000/docs
```

---

## 🐳 Docker

Todo o ambiente do projeto será executado utilizando Docker.

O objetivo é garantir que qualquer desenvolvedor consiga executar o projeto com o mínimo de configuração.

---

## 📚 Objetivos de aprendizado

Durante o desenvolvimento deste projeto serão explorados:

* Arquitetura Modular
* Repository Pattern
* Autenticação JWT
* Validação de dados
* Tratamento global de exceções
* Guards
* Pipes
* Interceptors
* Decorators personalizados
* Upload de arquivos
* Filas
* Mensageria
* Eventos
* Cache
* Agendamento de tarefas
* Testes
* Documentação

---

## 🛣 Roadmap

* [x] Modelagem inicial do banco
* [ ] Estrutura inicial do projeto
* [ ] Configuração do Docker
* [ ] Configuração do TypeORM
* [ ] Configuração do Swagger
* [ ] Cadastro de usuários
* [ ] Login
* [ ] Recuperação de senha
* [ ] Autenticação JWT
* [ ] Envio de e-mails
* [ ] Upload de arquivos
* [ ] BullMQ
* [ ] Redis
* [ ] Kafka
* [ ] Cron Jobs
* [ ] Notificações
* [ ] WebSockets
* [ ] Testes Unitários
* [ ] Testes E2E

---

## 📄 Licença

Este projeto foi desenvolvido com fins de estudo e aprendizado sobre o ecossistema do NestJS.
