import { Injectable } from '@nestjs/common';
import { Papel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface CriarUsuarioInput {
  nome: string;
  email: string;
  senhaHash: string;
  papel?: Papel;
}

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.usuario.findUnique({ where: { id } });
  }

  create(data: CriarUsuarioInput) {
    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senhaHash: data.senhaHash,
        papel: data.papel ?? Papel.DOADOR,
      },
    });
  }
}
