import { IsEmail, IsISBN, IsNotEmpty, IsString } from 'class-validator';
import { ProductModal } from 'src/product/dtos/product.modal';

export class UserRegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  products_created: [];
}
