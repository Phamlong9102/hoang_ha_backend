import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ProductService } from '../product.service';
import { UserEntity } from 'src/auth/entities/user.entity';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private productService: ProductService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user, params }: { user: UserEntity; params: { id: string } } =
      request;

    if (!user || !params) return false;

    // if (user.role === 'user') return true;

    // Determine if logged-in user is the same as the user that created the feed post
    if (user && params) {
      const userId = user.user_id;
      const productId = params.id;

      const _userId = await this.authService.throwUserId(userId);

      const creatorId = await this.productService.throwCreatorId(productId);

      if (_userId == creatorId) return true;

      return false;
    }
  }
}
