# CRUD de Pessoas — TRE-RR

Aplicação corporativa desenvolvida em **Angular 21** como avaliação prática do **Processo Seletivo de Estágio Remunerado 2026.1** do Tribunal Regional Eleitoral de Roraima.

> Secretaria de Tecnologia da Informação e Comunicação — Coordenadoria de Desenvolvimento e Arquitetura de Dados

## Sobre

Sistema de gerenciamento de cadastro de pessoas com operações completas de **CRUD** (Create, Read, Update, Delete) integrado à API REST do TRE-RR.

## Funcionalidades

- Listagem de pessoas com paginação (25 por página)
- Cadastro de nova pessoa com validação de todos os campos obrigatórios
- Edição de registro existente
- Exclusão de registro com confirmação
- Feedback visual de carregamento e erros

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Angular 21 | Framework principal |
| TypeScript 5.9 | Linguagem |
| Angular HttpClient | Consumo da API REST |
| Angular Reactive Forms | Formulários e validação |
| Angular Router | Navegação entre telas |
| CSS puro | Estilização |

## Como executar

> Pré-requisito: Node.js 18+ instalado.

```bash
npm install
npm start
```

Acesse `http://localhost:4200` no navegador.

## Estrutura

```
src/app/
├── models/
│   └── pessoa.model.ts       # Tipagem da entidade
├── services/
│   └── pessoa.service.ts     # CRUD via HttpClient
└── components/
    ├── pessoa-list/           # Tela de listagem
    └── pessoa-form/           # Formulário de cadastro/edição
```

## Rotas

| Rota | Descrição |
|---|---|
| `/pessoas` | Listagem com paginação |
| `/pessoas/novo` | Formulário de cadastro |
| `/pessoas/:cpf/editar` | Formulário de edição |

## API

**Base URL:** `https://gbebca2c3091cae-internshipdb1.adb.sa-saopaulo-1.oraclecloudapps.com/ords/estagio/pessoa/`

| Método | Endpoint | Ação |
|---|---|---|
| GET | `/` | Listar pessoas |
| GET | `/{cpf}` | Buscar por CPF |
| POST | `/` | Criar pessoa |
| PUT | `/{cpf}` | Atualizar pessoa |
| DELETE | `/{cpf}` | Excluir pessoa |
