import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Papel } from '@prisma/client';

export class RegisterDto {
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  senha: string;

  @IsOptional()
  @IsEnum(Papel)
  papel?: Papel;
}
