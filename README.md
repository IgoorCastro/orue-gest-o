# 🏭 ORUE Monolito - Sistema de Gestão de Estoque

[![Next.js 16.2.6](https://img.shields.io/badge/Next.js-16.2.6-000000?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma 7.8.0](https://img.shields.io/badge/Prisma-7.8.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Status](https://img.shields.io/badge/Status-MVP-yellow?style=flat-square)](#status)

Sistema moderno e escalável para gestão de estoque, inventário e movimentação de produtos com autenticação segura, controle de acesso baseado em roles e interface responsiva.

> **Nota:** Esta documentação é interna e destinada ao time técnico do cliente. O projeto não é um produto distribuído; o README serve como guia de desenvolvimento, deploy e manutenção.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Fluxos Principais](#-fluxos-principais)
- [Instalação](#-instalação)
- [Desenvolvimento](#-desenvolvimento)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Segurança](#-segurança)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Visão Geral

O **ORUE Monolito** é um sistema de gestão de estoque empresarial desenvolvido com as melhores práticas de Clean Architecture, TypeScript e Next.js. Oferece:

### ✨ Funcionalidades Principais

- **🔐 Autenticação Segura** - JWT com HttpOnly cookies, rate limiting e bcrypt
- **👥 Controle de Acesso** - Autorização baseada em roles (Admin, Operator)
- **📦 Gestão de Produtos** - Cadastro, edição, busca com múltiplos filtros
- **📊 Controle de Estoque** - Movimentação, saldos, histórico de transações
- **🏪 Multi-Loja** - Suporte para múltiplos armazéns/pontos de venda
- **🔍 Rastreabilidade** - Histórico completo de movimentações e alterações
- **📱 Interface Responsiva** - Design moderno com TailwindCSS + shadcn/ui
- **⚡ Performance** - Otimizado para produção com caching e lazy loading

### 📊 Módulos do Sistema

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Autenticação** | Login, logout, gerenciamento de sessão | ✅ Pronto |
| **Usuários** | Gestão de usuários e permissões | ✅ Pronto |
| **Produtos** | Cadastro e gestão de catálogo | ✅ Pronto |
| **Estoque** | Controle de inventário | ✅ Pronto |
| **Movimentações** | Histórico de entrada/saída | ✅ Pronto |
| **Atributos** | Cores, materiais, modelos, tamanhos | ✅ Pronto |
| **Transferências** | Movimentação entre lojas | ✅ Pronto |
| **Relatórios** | Análise e exportação de dados | 🔄 Em Progresso |

---

## 🏗️ Arquitetura

### Padrão: Clean Architecture + DDD

```
         ┌────────────────────────────────────┐
         │   📍 APRESENTAÇÃO (Mais Externa)   │
         │  UI, API Routes, Controllers       │
         └────────────────┬──────────────────┘
                          │
         ┌────────────────▼──────────────────┐
         │      📍 APLICAÇÃO                  │
         │  Use Cases, Orquestradores        │
         └────────────────┬──────────────────┘
                          │
         ┌────────────────▼──────────────────┐
         │    📍 INFRAESTRUTURA               │
         │ Implementações de Contratos       │
         │ Prisma, BD, Serviços Externos     │
         └────────────────┬──────────────────┘
                          │
         ┌────────────────▼──────────────────┐
         │  ✨ DOMÍNIO                       │
         │  ✨ Sem Dependências Externas     │
         │ Entidades, Regra de Negócio,      │
         │ Value Object, Interfaces/         │
         │ Contrtato                         │
         └────────────────────────────────────┘

```

#### 📚 O que cada camada faz:

| Camada | Responsabilidade | Exemplos |
|--------|------------------|----------|
| **Apresentação** | Expor interface para usuários | Páginas React, API Routes, controllers |
| **Aplicação** | Orquestrar fluxos de negócio | Use cases, DTOs, validação |
| **Infraestrutura** | Implementar contratos | Prisma, banco de dados, APIs externas |
| **Domínio** | Regras puras de negócio | Entidades, Value Objects, interfaces |

**🔑 Regra de Ouro:** 
- A camada **Domínio** define **INTERFACES** (contratos)
- A camada **Infraestrutura** implementa essas interfaces
- Infraestrutura ∉ Domínio, Domínio não importa Infraestrutura
- Resultado: Lógica de negócio **independente de tecnologia**

### Estrutura de Diretórios

```
src/
├── app/                           # Next.js App Router
---

## 🚀 Deployment (Vercel)

Before deploying to Vercel (or any hosting), ensure the following environment variables are set in the project settings:

- `DATABASE_URL` — PostgreSQL connection string used by Prisma
- `JWT_SECRET` — Secret used to sign and verify JWT tokens (required)
- `UPSTASH_REDIS_REST_URL` — (optional) Upstash Redis REST URL for rate limiting
- `UPSTASH_REDIS_REST_TOKEN` — (optional) Upstash Redis REST token for rate limiting
- `ALLOWED_ORIGINS` — (optional) Comma-separated list of allowed CORS origins (used by `src/proxy.ts`)

Notes:
- The app reads `auth-token` from HttpOnly cookies. Ensure `JWT_SECRET` matches the secret used when issuing the cookie.
- If you need server-to-server calls to internal API routes during SSR, prefer decoding JWT on the server (see `src/infrastructure/services/auth.ts`) rather than issuing internal fetches to relative URLs.

│   ├── (auth)/                   # Grupo de rotas de autenticação
│   │   └── login/page.tsx
│   ├── (dashboard)/              # Grupo de rotas protegidas
│   │   ├── color/
│   │   ├── inbound/
│   │   ├── material/
│   │   ├── model/
│   │   ├── outbound/
│   │   ├── product/
│   │   ├── stock/
│   │   ├── stock-moviment/
│   │   ├── store/
│   │   ├── user/
│   │   └── layout.tsx
│   ├── api/                      # Rotas de API
│   │   ├── auth/
│   │   ├── color/
│   │   ├── material/
│   │   ├── model/
│   │   ├── product/
│   │   ├── stock/
│   │   ├── user/
│   │   └── mapDomainErrorToStatus.error.ts
│   └── layout.tsx
│
├── application/                   # Lógica de aplicação
│   ├── login/
│   │   └── use-case/
│   ├── color/
│   ├── material/
│   ├── product/
│   ├── stock/
│   ├── user/
│   └── mappers/
│
├── domain/                        # Lógica de negócio
│   ├── enums/
│   │   └── UserRole.ts
│   ├── errors/
│   │   ├── ValidationError.ts
│   │   ├── NotFoundError.ts
│   │   └── ConflictError.ts
│   ├── repositories/
│   ├── services/
│   ├── value-objects/
│   ├── auth/
│   └── types/
│
├── infrastructure/                # Implementações técnicas
│   ├── config/
│   │   └── cors.ts
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── client.ts
│   │   │   ├── seed.ts
│   │   │   └── migrations/
│   │   └── repositories/
│   ├── auth/
│   └── services/
│
├── lib/                           # Utilitários compartilhados
│   ├── middleware/
│   ├── ratelimit.ts
│   └── schemas/
│
├── ui/                            # Componentes React
│   ├── components/
│   └── providers/
│
└── proxy.ts                       # Middleware central

public/                            # Assets estáticos
```

---

## 🔧 Tecnologias

### Frontend
- **Next.js 16.2.6** - Framework React com SSR e API routes
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **TailwindCSS 4** - Styling utilitário
- **shadcn/ui** - Componentes UI acessíveis
- **Lucide React** - Ícones
- **Zod** - Validação de schemas

### Backend
- **Next.js API Routes** - Endpoints serverless
- **Prisma 7.8.0** - ORM type-safe
- **PostgreSQL 13+** - Banco de dados relacional
- **JWT** - Autenticação stateless
- **Bcrypt** - Hash seguro de senhas
- **CORS** - Controle de origem cruzada

### DevOps & Build
- **Vercel** - Platform de deployment
- **ESLint 9** - Linting de código
- **PostCSS 4** - Processamento de CSS

---

## 📊 Fluxos Principais

### 1️⃣ Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant B as Browser
    participant A as API
    participant D as Banco de Dados

    U->>B: Digita credenciais
    B->>A: POST /api/auth/login
    A->>A: Valida com Zod
    A->>A: Verifica rate limit
    A->>D: Busca usuário por nickname
    D-->>A: Retorna usuário
    A->>A: Compara bcrypt(senha)
    A->>A: Gera JWT (válido por 24h)
    A->>B: Set-Cookie (auth-token, HttpOnly)
    A-->>B: { user, token }
    B->>B: Redireciona para /dashboard
```

**Características de Segurança:**
- ✅ Rate limiting: 5 tentativas por 15 minutos
- ✅ HttpOnly cookie: Inacessível para JavaScript
- ✅ Secure flag: Apenas enviado via HTTPS
- ✅ SameSite=Strict: Proteção contra CSRF
- ✅ Mensagens genéricas: Sem revelação de usuários

---

### 2️⃣ Fluxo de Solicitação Autenticada

```mermaid
sequenceDiagram
    participant C as Cliente
    participant M as Middleware (proxy.ts)
    participant G as Auth Guard
    participant A as API Handler
    participant D as Banco de Dados

    C->>M: GET /api/product (com cookie auth-token)
    M->>M: Valida CORS
    M->>G: Verifica token JWT
    G->>G: Decodifica e valida JWT
    G->>G: Verifica expiração
    G->>G: Verifica permissões por rota
    alt Token válido
        G->>A: Chama handler com contexto do usuário
        A->>D: Executa query
        D-->>A: Retorna dados
        A-->>C: { data }
    else Token inválido
        G-->>C: 401 Unauthorized
    end
```

---

### 3️⃣ Fluxo de Gestão de Produtos

```mermaid
graph TD
    A[Usuário acessa /dashboard/product] --> B{Autenticado?}
    B -->|Não| C[Redireciona para /login]
    B -->|Sim| D{Tem permissão?}
    D -->|Não| E[Redireciona para /]
    D -->|Sim| F[Carrega lista de produtos]
    F --> G[GET /api/product]
    G --> H[Valida autenticação]
    H --> I[Consulta Prisma]
    I --> J[Retorna produtos]
    J --> K[UI renderiza tabela]
    K --> L{Ação do usuário?}
    L -->|Criar| M[POST /api/product]
    L -->|Editar| N[PUT /api/product/id]
    L -->|Deletar| O[DELETE /api/product/id]
    L -->|Ver| P[GET /api/product/id]
    M --> Q[Valida com Zod schema]
    Q --> R[Salva no banco]
    R --> S[Retorna produto criado]
    S --> T[Atualiza UI]
```

---

### 4️⃣ Fluxo de Movimentação de Estoque

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant A as API
    participant P as Prisma
    participant DB as PostgreSQL

    U->>F: Registra entrada de estoque
    F->>A: POST /api/stockMoviment
    A->>A: Valida dados com Zod
    A->>A: Verifica permissões (ADMIN/MANAGER)
    A->>P: Transação: Begin
    P->>DB: Inicia transação
    A->>P: Cria registro em stock_moviment
    P->>DB: INSERT INTO stock_moviment
    A->>P: Atualiza saldo em stock
    P->>DB: UPDATE stock SET quantity
    A->>P: Transação: Commit
    P->>DB: COMMIT
    A-->>F: { moviment, newBalance }
    F->>F: Atualiza lista de movimentações
    U->>U: Vê novo saldo em tempo real
```

**Características:**
- ✅ Transações atômicas (tudo ou nada)
- ✅ Rastreamento completo
- ✅ Histórico imutável
- ✅ Soft deletes (dados nunca perdidos)

---

## 🚀 Instalação

### Pré-requisitos

```bash
✓ Node.js 18+ (recomendado 20+)
✓ npm ou yarn instalado
✓ PostgreSQL 13+ instalado e rodando
✓ Git instalado
```

### Passo 1: Clonar Repositório

```bash
git clone https://github.com/seu-repo/orue-monolito.git
cd orue-monolito
```

### Passo 2: Instalar Dependências

```bash
npm install
# ou
yarn install
```

### Passo 3: Configurar Banco de Dados

Criar arquivo `.env.local`:

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/orue_db?schema=public"

# Autenticação
JWT_SECRET="sua-chave-secreta-muito-segura-aqui-32-caracteres"

# Admin padrão (seed)
ADMIN_NICKNAME="admin@sistema.com"
ADMIN_PASSWORD="Admin123456"
ADMIN_NAME="Administrador do Sistema"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://127.0.0.1:3000"

# Ambiente
NODE_ENV="development"
```

### Passo 4: Configurar PostgreSQL

```bash
# Criar banco de dados
createdb orue_db

# Ou via psql
psql -U postgres
CREATE DATABASE orue_db;
```

### Passo 5: Executar Migrações

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate
```

### Passo 6: Semear Dados Iniciais

```bash
# Criar usuário admin padrão
npx prisma db seed
```

### Passo 7: Iniciar Desenvolvimento

```bash
npm run dev
# Abrirá em http://localhost:3000
```

---

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build            # Build otimizado para produção
npm start                # Inicia servidor de produção
npm run lint             # Executa ESLint

# Prisma
npm run prisma:generate  # Gera cliente Prisma
npm run prisma:migrate   # Cria e executa migrações
npm run prisma:studio    # Abre Prisma Studio (visualizador de BD)
```

### Fluxo de Desenvolvimento

1. **Criar nova funcionalidade em branch:**
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. **Desenvolver seguindo a arquitetura Clean Architecture:**
   - Criar entidade em `domain/`
   - Criar repositório interface em `domain/repositories/`
   - Criar implementação em `infrastructure/database/repositories/`
   - Criar use case em `application/`
   - Criar API route em `app/api/`
   - Criar componentes UI em `ui/`

3. **Validar código:**
   ```bash
   npm run lint
   npm run build
   ```

4. **Fazer commit:**
   ```bash
   git add .
   git commit -m "feat: descrição da mudança"
   git push origin feature/nova-funcionalidade
   ```

### Adicionando Nova Entidade

Exemplo: Criar módulo de "Fornecedores"

#### 1. Criar Modelo no Prisma

```prisma
// src/infrastructure/database/prisma/schema.prisma
model Supplier {
  id        String   @id @default(cuid())
  name      String   @unique
  email     String?
  phone     String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  products Product[]

  @@map("suppliers")
}
```

#### 2. Criar Migração

```bash
npm run prisma:migrate dev --name "add_suppliers_table"
```

#### 3. Criar Tipos de Domínio

```typescript
// src/domain/types/supplier.types.ts
export type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

export type CreateSupplierDTO = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};
```

#### 4. Criar Repository Interface

```typescript
// src/domain/repositories/supplier-repository.ts
import { Supplier, CreateSupplierDTO } from '@/domain/types/supplier.types';

export interface SupplierRepository {
  create(data: CreateSupplierDTO): Promise<Supplier>;
  findById(id: string): Promise<Supplier | null>;
  findAll(): Promise<Supplier[]>;
  update(id: string, data: Partial<CreateSupplierDTO>): Promise<Supplier>;
  delete(id: string): Promise<void>;
}
```

#### 5. Criar Implementação Prisma

```typescript
// src/infrastructure/database/repositories/prisma-supplier-repository.ts
import { prisma } from '@/infrastructure/database/prisma/client';
import { Supplier, CreateSupplierDTO } from '@/domain/types/supplier.types';
import { SupplierRepository } from '@/domain/repositories/supplier-repository';

export class PrismaSupplierRepository implements SupplierRepository {
  async create(data: CreateSupplierDTO): Promise<Supplier> {
    return prisma.supplier.create({ data });
  }

  async findById(id: string): Promise<Supplier | null> {
    return prisma.supplier.findUnique({ where: { id } });
  }

  async findAll(): Promise<Supplier[]> {
    return prisma.supplier.findMany({ where: { deletedAt: null } });
  }

  async update(id: string, data: Partial<CreateSupplierDTO>): Promise<Supplier> {
    return prisma.supplier.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.supplier.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
```

#### 6. Criar Use Cases

```typescript
// src/application/supplier/use-case/create-supplier.usecase.ts
import { CreateSupplierDTO } from '@/domain/types/supplier.types';
import { SupplierRepository } from '@/domain/repositories/supplier-repository';

export class CreateSupplierUseCase {
  constructor(private repository: SupplierRepository) {}

  async execute(input: CreateSupplierDTO) {
    // Validações de negócio aqui
    if (!input.name || input.name.length < 3) {
      throw new Error('Nome deve ter ao menos 3 caracteres');
    }

    return this.repository.create(input);
  }
}
```

#### 7. Criar API Route

```typescript
// src/app/api/supplier/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaSupplierRepository } from '@/infrastructure/database/repositories/prisma-supplier-repository';
import { CreateSupplierUseCase } from '@/application/supplier/use-case/create-supplier.usecase';

const createSupplierSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const repository = new PrismaSupplierRepository();
    const suppliers = await repository.findAll();
    return NextResponse.json(suppliers);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao listar fornecedores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createSupplierSchema.parse(body);

    const repository = new PrismaSupplierRepository();
    const useCase = new CreateSupplierUseCase(repository);
    const supplier = await useCase.execute(validated);

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao criar fornecedor' },
      { status: 400 }
    );
  }
}
```

---

## 📡 API Documentation

### Autenticação

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "nickname": "admin@sistema.com",
  "password": "senha"
}
```

**Resposta (200):**
```json
{
  "user": {
    "id": "uuid-123",
    "nickname": "admin@sistema.com",
    "name": "Administrador",
    "role": "ADMIN"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Resposta (401):**
```json
{
  "error": "Invalid credentials"
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "id": "uuid-123",
  "nickname": "admin@sistema.com",
  "name": "Administrador",
  "role": "ADMIN"
}
```

### Produtos

#### Listar Produtos

```http
GET /api/product?page=1&limit=10&search=termo
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "data": [
    {
      "id": "uuid-123",
      "name": "Produto A",
      "sku": "SKU-001",
      "barcode": "1234567890",
      "price": 99.99,
      "colors": ["Vermelho", "Azul"],
      "materials": ["Algodão"],
      "models": ["Modelo X"],
      "stock": 50,
      "createdAt": "2024-05-10T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### Criar Produto

```http
POST /api/product
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Novo Produto",
  "sku": "SKU-002",
  "description": "Descrição detalhada",
  "price": 99.99,
  "colors": ["uuid-color-1"],
  "materials": ["uuid-material-1"],
  "models": ["uuid-model-1"]
}
```

**Resposta (201):**
```json
{
  "id": "uuid-123",
  "name": "Novo Produto",
  "sku": "SKU-002",
  "price": 99.99,
  "createdAt": "2024-05-10T10:00:00Z"
}
```

#### Atualizar Produto

```http
PUT /api/product/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Produto Atualizado",
  "price": 109.99
}
```

**Resposta (200):**
```json
{
  "id": "uuid-123",
  "name": "Produto Atualizado",
  "price": 109.99
}
```

#### Deletar Produto

```http
DELETE /api/product/{id}
Authorization: Bearer {token}
```

**Resposta (204):** No content

### Estoque

#### Criar Movimentação de Estoque

```http
POST /api/stockMoviment
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "IN",
  "productId": "uuid-product",
  "storeId": "uuid-store",
  "quantity": 50,
  "description": "Entrada de compra"
}
```

**Resposta (201):**
```json
{
  "id": "uuid-123",
  "type": "IN",
  "productId": "uuid-product",
  "quantity": 50,
  "newBalance": 150,
  "createdAt": "2024-05-10T10:00:00Z"
}
```

#### Listar Movimentações

```http
GET /api/stockMoviment?productId={id}&storeId={id}
Authorization: Bearer {token}
```

**Resposta (200):**
```json
{
  "data": [
    {
      "id": "uuid-123",
      "type": "IN",
      "quantity": 50,
      "newBalance": 150,
      "description": "Entrada de compra",
      "createdAt": "2024-05-10T10:00:00Z",
      "createdBy": "Admin"
    }
  ]
}
```

---

## 🌐 Deployment

### Deploy no Vercel (Recomendado)

#### 1. Preparar Projeto

```bash
# Verificar se tudo está commitado
git status

# Build local
npm run build

# Verificar se não há erros
npm run lint
```

#### 2. Conectar ao Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel --prod
```

#### 3. Configurar Variáveis de Ambiente

No dashboard do Vercel:

**Ir para:** Settings → Environment Variables

**Adicionar:**
```
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=sua-chave-muito-segura-aqui
ALLOWED_ORIGINS=https://seu-app.vercel.app
ADMIN_NICKNAME=admin@sistema.com
ADMIN_PASSWORD=AdminPassword123
ADMIN_NAME=Admin
NODE_ENV=production
```

#### 4. Configurar Banco de Dados

**Opção 1: Supabase (PostgreSQL Gratuito)**
- Acesse https://supabase.com
- Crie novo projeto
- Copie DATABASE_URL para variáveis de ambiente

**Opção 2: Railway**
- Acesse https://railway.app
- Crie novo projeto com PostgreSQL
- Copie CONNECTION_STRING

**Opção 3: Neon**
- Acesse https://neon.tech
- Crie novo projeto PostgreSQL
- Copie CONNECTION_STRING

#### 5. Executar Migrações em Produção

```bash
# Após primeiro deploy
vercel env pull .env.production.local
npx prisma migrate deploy --skip-generate
```

#### 6. Verificar Deployment

```bash
# Abrir app em produção
vercel --prod open

# Ver logs
vercel logs
```

### Docker (Alternativa)

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build e rodar
docker build -t orue-monolito .
docker run -p 3000:3000 -e DATABASE_URL="..." orue-monolito
```

---

## 🔒 Segurança

### Implementações de Segurança

- ✅ **Autenticação JWT** com HttpOnly cookies
- ✅ **Bcrypt** para hash de senhas
- ✅ **Rate Limiting** para prevenção de brute-force
- ✅ **CORS** configurado adequadamente
- ✅ **Validação** com Zod em todas as inputs
- ✅ **SQL Injection Protection** via Prisma ORM
- ✅ **HTTPS** enforcement em produção
- ✅ **Soft Deletes** para auditoria
- ✅ **Input Sanitization** automática

### Melhores Práticas

1. **Nunca commitar `.env`** - Use `.env.example` como template
2. **Usar secrets seguros** - Gerar JWT_SECRET forte
3. **HTTPS obrigatório** - Sempre em produção
4. **Validar sempre** - Nunca confiar em input do usuário
5. **Atualizar dependências** - `npm update` regularmente
6. **Monitorar logs** - Investigar anomalias

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL not configured"

**Solução:**
```bash
# Verificar se .env.local existe
ls -la .env.local

# Se não existir, criar com valores corretos
cp .env.example .env.local

# Testar conexão
npx prisma db push --skip-generate
```

### Erro: "Port 3000 already in use"

```bash
# Matar processo na porta 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID {PID} /F

# macOS/Linux
lsof -i :3000
kill -9 {PID}

# Ou usar porta diferente
npm run dev -- -p 3001
```

### Erro: "Prisma Client not generated"

```bash
# Regenerar cliente
npm run prisma:generate

# Ou durante migrações
npm run prisma:migrate
```

### Banco de dados não conecta

```bash
# Testar conexão PostgreSQL
psql "postgresql://user:pass@localhost:5432/orue_db"

# Se não funcionar, verificar:
# 1. PostgreSQL rodando
# 2. Credenciais corretas
# 3. Firewall/rede
# 4. DATABASE_URL formatada corretamente
```

### Build falhando

```bash
# Limpar cache
rm -rf .next node_modules

# Reinstalar
npm install

# Rebuild
npm run build

# Se ainda falhar, verificar logs
npm run lint
```

### Rate limit atingido

```bash
# Aguardar 15 minutos ou

# Limpar cache em memória (dev)
# Reiniciar servidor: npm run dev

# Em produção
# Usar Redis distribuído (ver documentação Upstash)
```

---

## 🧑‍💻 Processo de Desenvolvimento Interno

Este sistema foi desenvolvido exclusivamente para o cliente e esta documentação tem foco na equipe técnica responsável pela implementação e manutenção.

### Workflow interno

1. Trabalhar em branch local dedicada à tarefa ou correção.
2. Usar nomes de branch claros: `feature/...`, `fix/...`, `chore/...`.
3. Testar localmente antes de enviar: `npm run lint` e `npm run build`.
4. Enviar mudanças para o repositório interno.
5. Registrar os objetivos da alteração de forma clara.

### Convenções de código

- **TypeScript strict mode** obrigatório
- **ESLint** deve estar limpo
- Componentes funcionais com hooks
- camelCase para variáveis
- UPPER_SNAKE_CASE para constantes
- Imports agrupados por tipo (built-in, node_modules, caminhos locais)

### Mensagens de commit

```
feat:     Nova funcionalidade
fix:      Correção de bug
refactor: Refatoração de código
style:    Mudança de estilo
docs:     Alteração na documentação
chore:    Alteração no build/dependências
```

---

## 📄 Nota de Uso

Este projeto é proprietário do cliente e deve ser tratado como solução interna sob contrato. Não compartilhe código, credenciais nem documentos fora do escopo combinado.


## 🙏 Agradecimentos

Desenvolvido com ❤️ usando:
- Next.js
- Prisma
- TypeScript
- TailwindCSS
- Comunidade open-source

---

**Última atualização:** May 11, 2026  
**Versão:** 1.0.0 - MVP  
**Status:** Em desenvolvimento ativo
**Desenvolvedor:** Igor Kaue Nardes de Castro
