import { IsEnum } from 'class-validator';
import { StatusCampanha } from '@prisma/client';

export class UpdateStatusDto {
  @IsEnum(StatusCampanha)
  status: StatusCampanha;
}
