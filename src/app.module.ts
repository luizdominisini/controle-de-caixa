import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsuarioModule } from './Usuario/usuario.module';
import { VendasModule } from './Vendas/vendas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    VendasModule,
    UsuarioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
