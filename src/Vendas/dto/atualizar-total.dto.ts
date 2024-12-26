import { IsNumber, IsOptional, IsString } from 'class-validator';

export class atualizarTotalDto {
  @IsNumber()
  valor: number;

  @IsString()
  @IsOptional()
  data?: string;
}
