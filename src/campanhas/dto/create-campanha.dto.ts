import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCampanhaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsDateString()
  dataInicio: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;
}
