import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '@prisma/client';
import { UsuariosService } from '../usuarios/usuarios.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existente = await this.usuariosService.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const usuario = await this.usuariosService.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      papel: dto.papel,
    });

    return this.gerarToken(usuario);
  }

  async validateUser(email: string, senha: string): Promise<Usuario | null> {
    const usuario = await this.usuariosService.findByEmail(email);
    if (!usuario) return null;

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) return null;

    return usuario;
  }

  async login(dto: LoginDto) {
    const usuario = await this.validateUser(dto.email, dto.senha);
    if (!usuario) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.gerarToken(usuario);
  }

  private gerarToken(usuario: Pick<Usuario, 'id' | 'email' | 'papel' | 'nome'>) {
    const payload = { sub: usuario.id, email: usuario.email, papel: usuario.papel };
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
      },
    };
  }
}
