import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CadastrarUsuarioDto } from './dto/cadastrar-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private readonly prismaService: PrismaService) {}

  async cadastrarUsuario(dados: CadastrarUsuarioDto) {
    return this.prismaService.usuario.create({
      data: {
        email: dados.email,
        password: dados.password,
      },
    });
  }
}
