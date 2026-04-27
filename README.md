# SolarGrid - Sistema de Monitoramento Social

## Visão Geral
Este é o Sistema de Monitoramento Social desenvolvido para a SolarGrid. A aplicação serve como um "Social Feed", onde comentários são extraídos de uma fonte externa, armazenados de forma persistente e exibidos em um painel seguro.

## Relatório de Funcionamento
O fluxo de ingestão de dados funciona da seguinte forma:
1. **Busca:** A aplicação consome a API pública do JSONPlaceholder (`https://jsonplaceholder.typicode.com/comments`).
2. **Processamento e Persistência:** Os dados recebidos (nome, email e corpo do comentário) são processados e salvos no banco de dados **Vercel Postgres** usando queries parametrizadas para garantir a segurança contra injeção de SQL.
3. **Exibição:** Os comentários persistidos são recuperados do banco de dados e apresentados em um feed reativo no frontend da aplicação.

## Guia de Autenticação
O sistema possui uma área administrativa (`/dashboard`) restrita a usuários autenticados.

- **Usuários:** Utilize qualquer usuário cadastrado no seu painel do Supabase Auth.
- **Senha:** A senha definida na criação do usuário no Supabase.

Um **Middleware** protege todas as rotas sob `/dashboard`, interceptando as requisições e verificando a presença de um cookie de sessão válido. Usuários não autenticados são automaticamente redirecionados para a página de login (`/login`).

## Instruções de Variáveis de Ambiente
Para rodar este projeto localmente, é necessário configurar as variáveis de ambiente referentes ao Vercel Postgres e outras chaves necessárias.

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis de ambiente (substitua os valores com as credenciais do seu banco de dados):

```env
POSTGRES_URL="postgres://default:..."
POSTGRES_PRISMA_URL="postgres://default:..."
POSTGRES_URL_NON_POOLING="postgres://default:..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```
