import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CampanhasModule } from './campanhas/campanhas.module';
import { PontosColetaModule } from './pontos-coleta/pontos-coleta.module';
import { ItensNecessariosModule } from './itens-necessarios/itens-necessarios.module';
import { DoacoesModule } from './doacoes/doacoes.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    //ServeStaticModule.forRoot({
      //rootPath: join(__dirname, '..', 'public'),
      //exclude: ['/api/*', '/health'],
    //}),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    CampanhasModule,
    PontosColetaModule,
    ItensNecessariosModule,
    DoacoesModule,
    HealthModule,
  ],
})
export class AppModule {}
