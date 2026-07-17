import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { Papel } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DoacoesService } from './doacoes.service';
import { CreateDoacaoDto } from './dto/create-doacao.dto';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'application/pdf'];
const TAMANHO_MAXIMO = 5 * 1024 * 1024; // 5MB

@Controller('doacoes')
export class DoacoesController {
  constructor(private doacoesService: DoacoesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.DOADOR)
  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateDoacaoDto) {
    return this.doacoesService.create(user.id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Papel.ORGANIZADOR)
  @Patch(':id/confirmar')
  confirmar(@Param('id') id: string) {
    return this.doacoesService.confirmar(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comprovante')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: './uploads/comprovantes',
        filename: (_req, file, callback) => {
          const nomeSeguro = `${randomUUID()}${extname(file.originalname)}`;
          callback(null, nomeSeguro);
        },
      }),
      limits: { fileSize: TAMANHO_MAXIMO },
      fileFilter: (_req, file, callback) => {
        if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
          callback(
            new BadRequestException(
              'Tipo de arquivo não permitido. Envie JPEG, PNG ou PDF.',
            ),
            false,
          );
          return;
        }
        callback(null, true);
      },
    }),
  )
  async uploadComprovante(
    @Param('id') id: string,
    @UploadedFile() arquivo: Express.Multer.File,
  ) {
    if (!arquivo) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }
    const doacao = await this.doacoesService.anexarComprovante(
      id,
      arquivo.filename,
    );
    return { id: doacao.id, comprovante: doacao.comprovanteUrl };
  }
}
