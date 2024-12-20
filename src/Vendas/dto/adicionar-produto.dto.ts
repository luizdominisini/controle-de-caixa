import { IsNumber, IsOptional, IsString } from 'class-validator';

export class adicionarProdutoDto {
  @IsString()
  descricao: string;

  @IsNumber()
  valor: number;

  @IsString()
  @IsOptional()
  data?: string;
}
