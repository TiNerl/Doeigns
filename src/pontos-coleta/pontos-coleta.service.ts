import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusCampanha } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePontoColetaDto } from './dto/create-ponto-coleta.dto';

@Injectable()
export class PontosColetaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePontoColetaDto) {
    await this.verificarCampanhaAtiva(dto.campanhaId);

    return this.prisma.pontoColeta.create({
      data: {
        nome: dto.nome,
        endereco: dto.endereco,
        latitude: dto.latitude,
        longitude: dto.longitude,
        campanhaId: dto.campanhaId,
      },
    });
  }

  findByCampanha(campanhaId: string) {
    return this.prisma.pontoColeta.findMany({ where: { campanhaId } });
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
        'Só é possível adicionar pontos de coleta a campanhas ativas',
      );
    }
  }
}
