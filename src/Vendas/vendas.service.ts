import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { PrismaService } from '../prisma/prisma.service';
import { adicionarProdutoDto } from './dto/adicionar-produto.dto';
import { atualizarTotalDto } from './dto/atualizar-total.dto';

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

      await this.atualizarTotalDiario(dados);
    } catch (error) {
      throw new BadRequestException('Erro ao salvar venda.', error.message);
    }
  }

  async atualizarTotalDiario(dados: atualizarTotalDto) {
    try {
      const totalDia = await this.prismaService.totalDiario.findUnique({
        where: { data: dados.data },
      });

      if (!totalDia) {
        await this.prismaService.totalDiario.create({
          data: { data: dados.data, totalVendas: dados.valor },
        });
        await this.atualizarTotalCaixa();
      } else {
        await this.prismaService.totalDiario.update({
          where: { id: totalDia.id },
          data: { totalVendas: dados.valor + totalDia.totalVendas },
        });
        await this.atualizarTotalCaixa();
      }
    } catch (error) {
      throw new BadRequestException(
        'Erro ao atualizar total diário.',
        error.message,
      );
    }
  }

  async atualizarTotalCaixa() {
    try {
      const totalCaixa = await this.prismaService.caixa.findFirst();
      const totalDia = await this.prismaService.totalDiario.findMany();
      let soma = 0;
      totalDia.forEach((v) => {
        soma += v.totalVendas;
      });

      if (!totalCaixa) {
        await this.prismaService.caixa.create({
          data: { saldoTotal: soma },
        });
      } else {
        await this.prismaService.caixa.update({
          where: { id: totalCaixa.id },
          data: { saldoTotal: soma },
        });
      }
    } catch (error) {
      throw new BadRequestException(
        'Erro ao atualizar total caixa.',
        error.message,
      );
    }
  }

  async buscarVendasPorData(data: string) {
    try {
      const vendas = await this.prismaService.venda.findMany({
        where: { dataVenda: data },
      });

      if (vendas.length === 0) {
        throw new NotFoundException('Não houve vendas nesta data.');
      }

      return { vendas };
    } catch (error) {
      throw new BadRequestException(
        'Erro ao procurar vendas por data.',
        error.message,
      );
    }
  }

  async buscarCaixa() {
    const caixa = await this.prismaService.caixa.findFirst();

    return { caixa };
  }

  async buscarTotalDia() {
    const totalDia = await this.prismaService.totalDiario.findMany();

    return { totalDia };
  }
}
