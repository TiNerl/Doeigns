import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Papel } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ItensNecessariosService } from './itens-necessarios.service';
import { CreateItemNecessarioDto } from './dto/create-item-necessario.dto';

@Controller('itens-necessarios')
export class ItensNecessariosController {
  constructor(private itensService: ItensNecessariosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.ORGANIZADOR)
  @Post()
  create(@Body() dto: CreateItemNecessarioDto) {
    return this.itensService.create(dto);
  }
}

@Controller('campanhas/:campanhaId/itens-necessarios')
export class ItensNecessariosPorCampanhaController {
  constructor(private itensService: ItensNecessariosService) {}

  @Get()
  findByCampanha(@Param('campanhaId') campanhaId: string) {
    return this.itensService.findByCampanha(campanhaId);
  }
}
