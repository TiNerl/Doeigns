# Rede de Doações e Campanhas Solidárias

API REST em **NestJS** + frontend em **Vue 3** para organização de campanhas
solidárias, pontos de coleta, itens necessários e doações. Grupo 7 — TSI.

## Stack

- Backend: NestJS + TypeScript, PostgreSQL (Neon DB) via **Prisma**
- Autenticação: Passport + JWT
- Upload de arquivos: Multer
- Frontend: Vue 3 + Vite + Vue Router
- Docker + docker-compose (build único, API e frontend no mesmo container)

## Domínio

- **Usuário**: papéis `DOADOR` e `ORGANIZADOR`
- **Campanha**: fluxo de estado `ABERTA → EM_ANDAMENTO → CONCLUIDA/CANCELADA`
- **PontoColeta** e **ItemNecessario**: associados a uma campanha
- **Doação**: associada a um item e a um doador; fluxo `PENDENTE → CONFIRMADA`

## Arquitetura do frontend + backend

A API roda sob o prefixo `/api` (ex: `/api/campanhas`), e o frontend Vue é
servido como arquivos estáticos na raiz (`/`, `/campanhas`, `/login`, etc.)
pelo mesmo processo Nest, via `@nestjs/serve-static`. Isso evita colisão
entre a rota de página `/campanhas` (Vue Router) e a rota de API
`/campanhas` (JSON) — sem o prefixo, as duas disputariam o mesmo caminho.

Em desenvolvimento, o frontend roda separado (Vite dev server, porta 5173)
e fala com a API via CORS. Em produção (Docker), o frontend é buildado e
copiado para dentro do container da API.

## Como rodar localmente (backend)

1. Copie o `.env.example` para `.env` e preencha `DATABASE_URL` (string de
   conexão do Neon) e `JWT_SECRET`.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Gere o client do Prisma e aplique as migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. (Opcional) Popule o banco com dados de demonstração:
   ```bash
   npm run prisma:seed
   ```
5. Suba a API:
   ```bash
   npm run start:dev
   ```

A API sobe em `http://localhost:3000/api`.

## Como rodar localmente (frontend)

Em outro terminal:

```bash
cd frontend
cp .env.example .env   # já aponta VITE_API_URL para http://localhost:3000
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173` e consome a API em `:3000` via CORS.

## Como rodar tudo com Docker (produção)

```bash
docker compose up --build
```

O Dockerfile builda o frontend Vue primeiro, copia o resultado (`dist/`)
para `public/` dentro da imagem da API, e o Nest serve tudo isso pela
mesma porta (3000). Acesse `http://localhost:3000` para ver o frontend, e
`http://localhost:3000/api/...` para a API diretamente.

O `docker-compose.yml` usa a variável `DATABASE_URL` do seu `.env` — por
padrão aponta pro Neon (banco gerenciado), então não é necessário subir um
container de banco separado.

## Endpoints principais (todos sob o prefixo `/api`)

| Método | Rota | Guard | Descrição |
|---|---|---|---|
| POST | `/api/auth/registro` | — | Cria usuário |
| POST | `/api/auth/login` | — | Retorna JWT |
| GET | `/api/usuarios/me` | JWT | Dados do usuário logado |
| GET | `/api/campanhas` | — | Lista com paginação (`page`, `limit`) e filtro (`status`) |
| POST | `/api/campanhas` | JWT + ORGANIZADOR | Cria campanha |
| PATCH | `/api/campanhas/:id` | JWT + ORGANIZADOR (dono) | Atualiza campanha |
| PATCH | `/api/campanhas/:id/status` | JWT + ORGANIZADOR (dono) | Transição de estado |
| GET | `/api/campanhas/:campanhaId/pontos-coleta` | — | Lista pontos de uma campanha |
| POST | `/api/pontos-coleta` | JWT + ORGANIZADOR | Cria ponto de coleta |
| GET | `/api/campanhas/:campanhaId/itens-necessarios` | — | Lista itens de uma campanha |
| POST | `/api/itens-necessarios` | JWT + ORGANIZADOR | Cria item necessário |
| POST | `/api/doacoes` | JWT + DOADOR | Registra doação (`PENDENTE`) |
| PATCH | `/api/doacoes/:id/confirmar` | JWT + ORGANIZADOR | Confirma doação |
| POST | `/api/doacoes/:id/comprovante` | JWT | Upload multipart do comprovante (jpg/png/pdf, máx. 5MB) |
| GET | `/health` | — | Status da conexão com o banco (fora do prefixo `/api`, por convenção) |

## Regras de negócio implementadas

- Só o organizador dono de uma campanha pode alterar seu status ou dados (`403`).
- Transições de status inválidas retornam `400` (ex: `CONCLUIDA → ABERTA`).
- Pontos de coleta e itens só podem ser criados em campanhas `ABERTA` ou
  `EM_ANDAMENTO` (`409` caso contrário).
- Uma doação não pode exceder a quantidade restante necessária do item (`409`).
- Confirmar uma doação atualiza a quantidade arrecadada do item de forma
  transacional (`$transaction` do Prisma).
- Upload de comprovante valida tipo (jpg/png/pdf) e tamanho (máx. 5MB), e
  gera um nome de arquivo seguro (UUID) — o caminho interno nunca é exposto
  na resposta.

## Frontend — telas implementadas

- **Login / Registro** (`/login`, `/registro`): autenticação com JWT salvo
  no `localStorage`.
- **Campanhas** (`/campanhas`): listagem com paginação e filtro por status.
- **Nova campanha** (`/campanhas/nova`): formulário, restrito a organizadores.
- **Detalhe da campanha** (`/campanhas/:id`): itens necessários com barra de
  progresso, pontos de coleta, formulários de adicionar item/ponto (dono) e
  botão de transição de status (dono).
- **Nova doação** (`/doacoes/nova`): formulário de quantidade + upload do
  comprovante (multipart), acessível a partir de um item na campanha.

## Variáveis de ambiente

Backend: ver `.env.example`. Frontend: ver `frontend/.env.example`. Nunca
versionar os arquivos `.env` reais.

## Estrutura do projeto

```
├── src/                      # backend NestJS
│   ├── auth/                 # registro, login, JWT
│   ├── usuarios/              # perfil doador/organizador
│   ├── campanhas/             # CRUD + fluxo de estado
│   ├── pontos-coleta/
│   ├── itens-necessarios/
│   ├── doacoes/               # criação + confirmação + upload
│   ├── health/                # health check
│   ├── prisma/                # PrismaService/PrismaModule
│   └── common/                # guards, decorators, exception filter
├── frontend/                 # SPA Vue 3 + Vite
│   └── src/
│       ├── views/             # telas (login, campanhas, doação...)
│       ├── components/        # SeloStatus, BarraProgresso
│       ├── composables/       # useAuth
│       ├── services/          # cliente HTTP (api.js)
│       └── router/            # rotas + guards
├── prisma/                   # schema, seed
└── public/                   # build do frontend copiado aqui em produção
```

## Próximos passos (não obrigatórios, mas recomendados)

- Swagger/OpenAPI (`@nestjs/swagger`).
- Testes automatizados (unitários e e2e).
