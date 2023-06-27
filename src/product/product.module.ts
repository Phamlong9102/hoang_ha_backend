import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductController } from './product.controller';
import { AuthModule } from 'src/auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), AuthModule],
  providers: [ProductService, IsCreatorGuard],
  controllers: [ProductController],
})
export class ProductModule {}
