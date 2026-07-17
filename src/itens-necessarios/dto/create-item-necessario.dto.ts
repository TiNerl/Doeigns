import { IsInt, IsNotEmpty, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateItemNecessarioDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsInt()
  @IsPositive()
  quantidadeNecessaria: number;

  @IsUUID()
  campanhaId: string;
}
