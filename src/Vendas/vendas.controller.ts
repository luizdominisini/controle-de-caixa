import { Body, Controller, Get, Post } from '@nestjs/common';
import { adicionarProdutoDto } from './dto/adicionar-produto.dto';
import { VendasService } from './vendas.service';

@Controller('v1/vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post('add')
  async adicionarProduto(@Body() dados: adicionarProdutoDto) {
    return this.vendasService.adicionarProduto(dados);
  }

  @Post('buscar')
  async buscarVendasPorData(@Body('data') data: string) {
    return this.vendasService.buscarVendasPorData(data);
  }

  @Get('caixa')
  async buscarCaixa() {
    return this.vendasService.buscarCaixa();
  }

  @Get('totalDia')
  async buscarTotalDia() {
    return this.vendasService.buscarTotalDia();
  }
}
