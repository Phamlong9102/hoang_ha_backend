import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(
    user: UserEntity,
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    createProductDto.user_created = user;
    const savedProduct = await this.productRepository.create(createProductDto);
    await this.productRepository.save(savedProduct);
    return savedProduct;
  }

  async getAllProduct(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  // async findProductById(product_id: string): Promise<ProductEntity> {
  //   const product = await this.productRepository.findOne({
  //     where: { product_id: product_id },
  //     relations: ['products_created'],
  //   });

  //   if (!product) {
  //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  //   }

  //   return product;
  // }

  async updateProduct(
    product_id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<UpdateResult> {
    const product = await this.productRepository.findOne({
      where: { product_id: product_id },
    });

    if (!product) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Product not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.productRepository.update(product_id, updateProductDto);
  }

  async deteleProduct(product_id): Promise<DeleteResult> {
    const product = await this.productRepository.findOne({
      where: { product_id: product_id },
    });

    if (!product) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Product not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return this.productRepository.delete(product_id);
  }

  async throwCreatorId(product_id: string): Promise<string> {
    const product = await this.productRepository.findOne({
      where: { product_id },
      relations: ['user_created'],
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product) {
      console.log('creatorId: ', product.user_created.user_id);

      return product.user_created.user_id;
    }
  }
}
