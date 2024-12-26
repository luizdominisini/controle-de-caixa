import { Body, Controller, Post } from '@nestjs/common';
import { CadastrarUsuarioDto } from './dto/cadastrar-usuario.dto';
import { UsuarioService } from './usuario.service';

@Controller('v1/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async cadastrarUsuario(@Body() dados: CadastrarUsuarioDto) {
    return this.usuarioService.cadastrarUsuario(dados);
  }
}
