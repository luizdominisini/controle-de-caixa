import { Body, Controller, Post } from '@nestjs/common';
import { adicionarProdutoDto } from './dto/adicionar-produto.dto';
import { VendasService } from './vendas.service';

@Controller('v1/vendas')
export class VendasController {
  constructor(private readonly vendasService: VendasService) {}

  @Post('add')
  async adicionarProduto(@Body() dados: adicionarProdutoDto) {
    return this.vendasService.adicionarProduto(dados);
  }
}
