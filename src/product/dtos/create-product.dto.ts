import { IsNotEmpty, IsNumber, IsString, NotContains } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
