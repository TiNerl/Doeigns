import { Module } from '@nestjs/common';
import { CampanhasController } from './campanhas.controller';
import { CampanhasService } from './campanhas.service';
import { CampanhaStateService } from './campanha-state.service';

@Module({
  controllers: [CampanhasController],
  providers: [CampanhasService, CampanhaStateService],
  exports: [CampanhasService],
})
export class CampanhasModule {}
