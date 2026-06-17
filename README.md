# Doceira

Aplicativo mobile de receitas de confeitaria (doces) desenvolvido com React Native + Expo + TypeScript, com backend proprio em Express + Drizzle + PostgreSQL (Docker).

---

## Integrante

| Nome | Matricula | Atribuicoes |
|------|-----------|-------------|
| Ana Gabriela Franco | UC22200537 | Desenvolvimento integral do projeto: frontend (React Native/Expo), backend (Express/Drizzle/PostgreSQL), modelagem do banco, autenticacao, telas e funcionalidades |

---

## Sobre o projeto

O Doceira e um app de receitas doces que conecta confeiteiras e amantes de doces. Os usuarios podem descobrir, favoritar, comentar e compartilhar receitas. O app tem controle de acesso por perfil.

### Perfis de usuario
- Leitor: visualiza, comenta e favorita receitas
- Confeiteira: cria suas proprias receitas (enviadas para aprovacao)
- Admin: aprova receitas, acessa o dashboard e gerencia todo o sistema

### Funcionalidades
- Cadastro e login com autenticacao (JWT + bcrypt)
- Listagem de receitas publicadas na Home
- Detalhe da receita com ingredientes, modo de preparo, ajuste de porcoes e timer integrado
- Favoritar / desfavoritar receitas (salvo no banco)
- Comentarios por receita (com nome do autor)
- Lista de compras (armazenamento local)
- Conversor de medidas
- Compartilhar receita (compartilhamento nativo)
- Fluxo de aprovacao: confeiteira cria, admin aprova, aparece para todos
- Painel administrativo com CRUDs de usuarios, receitas, categorias e comentarios
- Busca e categorias

---

## Tecnologias

Frontend: React Native, Expo SDK 54, TypeScript, Expo Router, AsyncStorage

Backend: Express, TypeScript, Drizzle ORM, PostgreSQL (Docker), JWT + bcryptjs

---

## Como executar o projeto

O projeto tem duas partes: backend (API + banco) e frontend (app). Rode o backend primeiro.

### Pre-requisitos
- Node.js v18 ou superior
- Docker Desktop
- Expo Go instalado no celular (Android ou iOS)
- O celular e o computador devem estar na mesma rede Wi-Fi

### 1. Backend (API + Banco de dados)

Clone o repositorio do backend e entre na pasta:

    git clone https://github.com/anagabrielaf/doceira-backend.git
    cd doceira-backend

Instale as dependencias:

    npm install --legacy-peer-deps

Suba o banco PostgreSQL com Docker (deixe o Docker Desktop aberto):

    docker compose up -d

Crie as tabelas no banco:

    npx drizzle-kit push

Popule o banco com dados iniciais:

    npx tsx src/seed.ts

Inicie o servidor:

    npx tsx src/index.ts

O servidor roda na porta 3000. Deve aparecer a mensagem "Servidor rodando na porta 3000".

### 2. Frontend (App mobile)

Clone o repositorio do frontend e entre na pasta:

    git clone https://github.com/anagabrielaf/doceira-app.git
    cd doceira-app

Instale as dependencias:

    npm install --legacy-peer-deps

IMPORTANTE - configurar o IP da sua maquina:

O app precisa saber o IP do computador onde o backend esta rodando. Descubra seu IP com "ipconfig" (Windows) e procure o Endereco IPv4 do adaptador Wi-Fi. Depois abra o arquivo lib/api.ts e altere a primeira linha com o seu IP:

    const API_URL = "http://SEU_IP_AQUI:3000";

Inicie o app (Windows PowerShell):

    $env:REACT_NATIVE_PACKAGER_HOSTNAME="SEU_IP_AQUI"
    npx expo start --clear

Escaneie o QR Code com o Expo Go (Android) ou a camera (iOS).

---

## Credenciais de teste

| Perfil | E-mail | Senha |
|--------|--------|-------|
| Admin | admin@doceira.com | 123456 |
| Confeiteira | amanda@teste.com | 123456 |
| Leitor | leitora@teste.com | 123456 |

---

## Observacoes

- O envio de e-mail na tela "Lembrar senha" e demonstrativo.
- O backend precisa estar rodando para o app funcionar.
