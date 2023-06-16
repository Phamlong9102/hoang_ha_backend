import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProductDto);
  }

  @Get()
  async getAll(): Promise<ProductEntity[]> {
    try {
      return this.productService.getAllProduct();
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Get(':product_id')
  async findById(
    @Param('product_id') product_id: string,
  ): Promise<ProductEntity> {
    return this.productService.findProductById(product_id);
  }

  @Patch('update/:product_id')
  async update(
    @Param('product_id') product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return this.productService.updateProduct(product_id, updateProductDto);
  }

  @Delete('delete/:product_id')
  async delete(@Param('product_id') product_id: string): Promise<DeleteResult> {
    return this.productService.deteleProduct(product_id);
  }
}
