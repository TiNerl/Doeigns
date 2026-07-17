import { PrismaClient, Papel, StatusCampanha } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash('senha123', 10);

  const organizador = await prisma.usuario.create({
    data: {
      nome: 'Ana Organizadora',
      email: 'ana@doacoes.com',
      senhaHash,
      papel: Papel.ORGANIZADOR,
    },
  });

  const doador = await prisma.usuario.create({
    data: {
      nome: 'Bruno Doador',
      email: 'bruno@doacoes.com',
      senhaHash,
      papel: Papel.DOADOR,
    },
  });

  const campanha1 = await prisma.campanha.create({
    data: {
      titulo: 'Inverno Solidário',
      descricao: 'Arrecadação de agasalhos para famílias carentes',
      status: StatusCampanha.ABERTA,
      dataInicio: new Date(),
      organizadorId: organizador.id,
    },
  });

  const campanha2 = await prisma.campanha.create({
    data: {
      titulo: 'Enchentes 2026',
      descricao: 'Apoio a famílias atingidas por enchentes',
      status: StatusCampanha.EM_ANDAMENTO,
      dataInicio: new Date(),
      organizadorId: organizador.id,
    },
  });

  await prisma.pontoColeta.createMany({
    data: [
      { nome: 'Ponto Centro', endereco: 'Rua Principal, 100', campanhaId: campanha1.id },
      { nome: 'Ponto Zona Sul', endereco: 'Av. Sul, 200', campanhaId: campanha1.id },
      { nome: 'Ponto Zona Norte', endereco: 'Av. Norte, 300', campanhaId: campanha2.id },
    ],
  });

  const item1 = await prisma.itemNecessario.create({
    data: { nome: 'Cobertores', quantidadeNecessaria: 100, campanhaId: campanha1.id },
  });

  await prisma.itemNecessario.createMany({
    data: [
      { nome: 'Casacos', quantidadeNecessaria: 50, campanhaId: campanha1.id },
      { nome: 'Água potável (litros)', quantidadeNecessaria: 500, campanhaId: campanha2.id },
      { nome: 'Kits de higiene', quantidadeNecessaria: 80, campanhaId: campanha2.id },
    ],
  });

  await prisma.doacao.createMany({
    data: [
      { doadorId: doador.id, itemId: item1.id, quantidade: 5 },
      { doadorId: doador.id, itemId: item1.id, quantidade: 3 },
    ],
  });

  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
