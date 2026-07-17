import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Papel, StatusCampanha } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CampanhasService } from './campanhas.service';
import { CreateCampanhaDto } from './dto/create-campanha.dto';
import { UpdateCampanhaDto } from './dto/update-campanha.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('campanhas')
export class CampanhasController {
  constructor(private campanhasService: CampanhasService) {}

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: StatusCampanha,
  ) {
    return this.campanhasService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      status,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campanhasService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.ORGANIZADOR)
  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateCampanhaDto) {
    return this.campanhasService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.ORGANIZADOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateCampanhaDto,
  ) {
    return this.campanhasService.update(id, user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.ORGANIZADOR)
  @Patch(':id/status')
  atualizarStatus(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateStatusDto,
  ) {
    return this.campanhasService.atualizarStatus(id, user.id, dto.status);
  }
}
