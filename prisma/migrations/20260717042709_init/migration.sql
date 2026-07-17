-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('DOADOR', 'ORGANIZADOR');

-- CreateEnum
CREATE TYPE "StatusCampanha" AS ENUM ('ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "StatusDoacao" AS ENUM ('PENDENTE', 'CONFIRMADA', 'ENTREGUE', 'CANCELADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "Papel" NOT NULL DEFAULT 'DOADOR',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campanha" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusCampanha" NOT NULL DEFAULT 'ABERTA',
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "organizadorId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PontoColeta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "campanhaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PontoColeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemNecessario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidadeNecessaria" INTEGER NOT NULL,
    "quantidadeArrecadada" INTEGER NOT NULL DEFAULT 0,
    "campanhaId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemNecessario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doacao" (
    "id" TEXT NOT NULL,
    "doadorId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "status" "StatusDoacao" NOT NULL DEFAULT 'PENDENTE',
    "comprovanteUrl" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Campanha_organizadorId_idx" ON "Campanha"("organizadorId");

-- CreateIndex
CREATE INDEX "PontoColeta_campanhaId_idx" ON "PontoColeta"("campanhaId");

-- CreateIndex
CREATE INDEX "ItemNecessario_campanhaId_idx" ON "ItemNecessario"("campanhaId");

-- CreateIndex
CREATE INDEX "Doacao_doadorId_idx" ON "Doacao"("doadorId");

-- CreateIndex
CREATE INDEX "Doacao_itemId_idx" ON "Doacao"("itemId");

-- AddForeignKey
ALTER TABLE "Campanha" ADD CONSTRAINT "Campanha_organizadorId_fkey" FOREIGN KEY ("organizadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PontoColeta" ADD CONSTRAINT "PontoColeta_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemNecessario" ADD CONSTRAINT "ItemNecessario_campanhaId_fkey" FOREIGN KEY ("campanhaId") REFERENCES "Campanha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_doadorId_fkey" FOREIGN KEY ("doadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "ItemNecessario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
