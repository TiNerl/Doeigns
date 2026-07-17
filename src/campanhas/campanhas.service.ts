import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusCampanha } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';
import { CampanhaStateService } from './campanha-state.service';

@Injectable()
export class CampanhasService {
  constructor(
    private prisma: PrismaService,
    private stateService: CampanhaStateService,
  ) {}

  create(organizadorId: string, dto: CreateCampanhaDto) {
    return this.prisma.campanha.create({
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        dataInicio: new Date(dto.dataInicio),
        dataFim: dto.dataFim ? new Date(dto.dataFim) : null,
        organizadorId,
      },
    });
  }

  async findAll(page = 1, limit = 10, status?: StatusCampanha) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [dados, total] = await Promise.all([
      this.prisma.campanha.findMany({
        where,
        skip,
        take: limit,
        orderBy: { criadoEm: 'desc' },
      }),
      this.prisma.campanha.count({ where }),
    ]);

    return { dados, total, page, limit };
  }

  async findOne(id: string) {
    const campanha = await this.prisma.campanha.findUnique({ where: { id } });
    if (!campanha) {
      throw new NotFoundException('Campanha não encontrada');
    }
    return campanha;
  }

  async update(id: string, usuarioId: string, dto: UpdateCampanhaDto) {
    const campanha = await this.findOne(id);
    this.verificarDono(campanha.organizadorId, usuarioId);

    return this.prisma.campanha.update({
      where: { id },
      data: {
        titulo: dto.titulo,
        descricao: dto.descricao,
        dataInicio: dto.dataInicio ? new Date(dto.dataInicio) : undefined,
        dataFim: dto.dataFim ? new Date(dto.dataFim) : undefined,
      },
    });
  }

  async atualizarStatus(id: string, usuarioId: string, novoStatus: StatusCampanha) {
    const campanha = await this.findOne(id);
    this.verificarDono(campanha.organizadorId, usuarioId);
    this.stateService.validarTransicao(campanha.status, novoStatus);

    return this.prisma.campanha.update({
      where: { id },
      data: { status: novoStatus },
    });
  }

  private verificarDono(organizadorId: string, usuarioId: string) {
    if (organizadorId !== usuarioId) {
      throw new ForbiddenException(
        'Apenas o organizador dono da campanha pode realizar esta ação',
      );
    }
  }
}
