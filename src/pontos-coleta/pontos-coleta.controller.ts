import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Papel } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PontosColetaService } from './pontos-coleta.service';
import { CreatePontoColetaDto } from './dto/create-ponto-coleta.dto';

@Controller('pontos-coleta')
export class PontosColetaController {
  constructor(private pontosColetaService: PontosColetaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.ORGANIZADOR)
  @Post()
  create(@Body() dto: CreatePontoColetaDto) {
    return this.pontosColetaService.create(dto);
  }
}

@Controller('campanhas/:campanhaId/pontos-coleta')
export class PontosColetaPorCampanhaController {
  constructor(private pontosColetaService: PontosColetaService) {}

  @Get()
  findByCampanha(@Param('campanhaId') campanhaId: string) {
    return this.pontosColetaService.findByCampanha(campanhaId);
  }
}
