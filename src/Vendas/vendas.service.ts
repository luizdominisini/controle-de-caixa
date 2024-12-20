import { BadRequestException, Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '../prisma/prisma.service';
import { adicionarProdutoDto } from './dto/adicionar-produto.dto';

@Injectable()
export class VendasService {
  constructor(private prismaService: PrismaService) {}

  async adicionarProduto(dados: adicionarProdutoDto) {
    const dataAtual = DateTime.now()
      .setZone('America/Sao_Paulo')
      .toFormat('dd/MM/yy');

    dados.data = dataAtual;

    try {
      await this.prismaService.venda.create({
        data: {
          dataVenda: dados.data,
          descricao: dados.descricao,
          valor: dados.valor,
        },
      });

      const totalDiario = await this.prismaService.totalDiario.findUnique({
        where: { data: dataAtual },
      });

      const caixa = await this.prismaService.caixa.findFirst();

      if (!totalDiario) {
        await this.prismaService.totalDiario.create({
          data: { totalVendas: dados.valor, data: dataAtual },
        });
      } else {
        const somarDia = totalDiario.totalVendas + dados.valor;
        await this.prismaService.totalDiario.update({
          where: { id: totalDiario.id },
          data: { totalVendas: somarDia, data: dataAtual },
        });
      }

      if (!caixa) {
        await this.prismaService.caixa.create({
          data: { saldoTotal: dados.valor },
        });
      } else {
        const somarCaixa = totalDiario.totalVendas + caixa.saldoTotal;
        await this.prismaService.caixa.update({
          where: { id: caixa.id },
          data: { saldoTotal: somarCaixa },
        });
      }
    } catch (error) {
      throw new BadRequestException('Erro ao salvar venda.', error.message);
    }
  }
}
