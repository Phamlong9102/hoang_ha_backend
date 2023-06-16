import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    const savedProduct = await this.productRepository.save(createProductDto);
    return savedProduct;
  }

  async getAllProduct(): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  async findProductById(product_id: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { product_id: product_id },
    });

    if (!product) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Product not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

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
}
