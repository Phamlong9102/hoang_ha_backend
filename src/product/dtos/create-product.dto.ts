import { IsNotEmpty, IsNumber, IsString, NotContains } from 'class-validator';
import { UserEntity } from 'src/auth/entities/user.entity';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  user_created: UserEntity;
}
