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
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Roles(Role.USER)
  @UseGuards(JwtGuard, RolesGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(req.user, createProductDto);
  }

  @Get()
  async getAll(): Promise<ProductEntity[]> {
    try {
      return this.productService.getAllProduct();
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  // @UseGuards(JwtGuard, IsCreatorGuard)
  // @Get(':product_id')
  // async findById(
  //   @Param('product_id') product_id: string,
  // ): Promise<ProductEntity> {
  //   return this.productService.findProductById(product_id);
  // }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Patch('update/:product_id')
  async update(
    @Param('product_id') product_id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    return this.productService.updateProduct(product_id, updateProductDto);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete('delete/:product_id')
  async delete(@Param('product_id') product_id: string): Promise<DeleteResult> {
    return this.productService.deteleProduct(product_id);
  }
}
