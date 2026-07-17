import { Module } from '@nestjs/common';
import {
  PontosColetaController,
  PontosColetaPorCampanhaController,
} from './pontos-coleta.controller';
import { PontosColetaService } from './pontos-coleta.service';

@Module({
  controllers: [PontosColetaController, PontosColetaPorCampanhaController],
  providers: [PontosColetaService],
})
export class PontosColetaModule {}
