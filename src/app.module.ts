import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VendasModule } from './Vendas/vendas.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), VendasModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
