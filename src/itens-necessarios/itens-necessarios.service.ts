import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusCampanha } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemNecessarioDto } from './dto/create-item-necessario.dto';

@Injectable()
export class ItensNecessariosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateItemNecessarioDto) {
    await this.verificarCampanhaAtiva(dto.campanhaId);

    return this.prisma.itemNecessario.create({
      data: {
        nome: dto.nome,
        quantidadeNecessaria: dto.quantidadeNecessaria,
        campanhaId: dto.campanhaId,
      },
    });
  }

  findByCampanha(campanhaId: string) {
    return this.prisma.itemNecessario.findMany({ where: { campanhaId } });
  }

  findOne(id: string) {
    return this.prisma.itemNecessario.findUnique({ where: { id } });
  }

  private async verificarCampanhaAtiva(campanhaId: string) {
    const campanha = await this.prisma.campanha.findUnique({
      where: { id: campanhaId },
    });
    if (!campanha) {
      throw new NotFoundException('Campanha não encontrada');
    }
    const statusAtivos: StatusCampanha[] = [
      StatusCampanha.ABERTA,
      StatusCampanha.EM_ANDAMENTO,
    ];
    const ativa = statusAtivos.includes(campanha.status);
    if (!ativa) {
      throw new ConflictException(
        'Só é possível adicionar itens a campanhas ativas',
      );
    }
  }
}
