import { Module } from '@nestjs/common';
import {
  ItensNecessariosController,
  ItensNecessariosPorCampanhaController,
} from './itens-necessarios.controller';
import { ItensNecessariosService } from './itens-necessarios.service';

@Module({
  controllers: [
    ItensNecessariosController,
    ItensNecessariosPorCampanhaController,
  ],
  providers: [ItensNecessariosService],
  exports: [ItensNecessariosService],
})
export class ItensNecessariosModule {}
