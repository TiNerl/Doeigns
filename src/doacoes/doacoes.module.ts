import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { DoacoesController } from './doacoes.controller';
import { DoacoesService } from './doacoes.service';

@Module({
  imports: [MulterModule.register()],
  controllers: [DoacoesController],
  providers: [DoacoesService],
})
export class DoacoesModule {}
