import { IsInt, IsPositive, IsUUID } from 'class-validator';

export class CreateDoacaoDto {
  @IsUUID()
  itemId: string;

  @IsInt()
  @IsPositive()
  quantidade: number;
}
