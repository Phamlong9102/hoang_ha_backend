import { IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  product_name: string;

  @IsOptional()
  price: number;
}
