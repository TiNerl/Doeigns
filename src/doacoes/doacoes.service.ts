import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusDoacao } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoacaoDto } from './dto/create-doacao.dto';

@Injectable()
export class DoacoesService {
  constructor(private prisma: PrismaService) {}

  async create(doadorId: string, dto: CreateDoacaoDto) {
    const item = await this.prisma.itemNecessario.findUnique({
      where: { id: dto.itemId },
    });
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    const restante = item.quantidadeNecessaria - item.quantidadeArrecadada;
    if (dto.quantidade > restante) {
      throw new ConflictException(
        `Quantidade doada (${dto.quantidade}) excede o restante necessário (${restante})`,
      );
    }

    return this.prisma.doacao.create({
      data: {
        doadorId,
        itemId: dto.itemId,
        quantidade: dto.quantidade,
      },
    });
  }

  async confirmar(id: string) {
    const doacao = await this.prisma.doacao.findUnique({ where: { id } });
    if (!doacao) {
      throw new NotFoundException('Doação não encontrada');
    }
    if (doacao.status !== StatusDoacao.PENDENTE) {
      throw new ConflictException(
        'Somente doações pendentes podem ser confirmadas',
      );
    }

    const [, doacaoAtualizada] = await this.prisma.$transaction([
      this.prisma.itemNecessario.update({
        where: { id: doacao.itemId },
        data: { quantidadeArrecadada: { increment: doacao.quantidade } },
      }),
      this.prisma.doacao.update({
        where: { id },
        data: { status: StatusDoacao.CONFIRMADA },
      }),
    ]);

    return doacaoAtualizada;
  }

  async anexarComprovante(id: string, comprovanteUrl: string) {
    const doacao = await this.prisma.doacao.findUnique({ where: { id } });
    if (!doacao) {
      throw new NotFoundException('Doação não encontrada');
    }
    return this.prisma.doacao.update({
      where: { id },
      data: { comprovanteUrl },
    });
  }
}
