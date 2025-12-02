import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.enitty';
import { CartProxy } from './proxy/Cart.proxy';
import { CartFascade } from './fascade/cart.fascade';
import { DefaultCartPricingStrategy } from './strategy/cart.strategy';
import { UserClientService } from '../user/userClient.service';
import { CourseClientService } from '../course/courseClient.service';
import { AuthCommonModule } from '@course-plateform/common';
import { NatsModule } from 'src/common/nats/nats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    CartService,
    CartProxy,
    CartFascade,
    DefaultCartPricingStrategy,
    CartResolver,
    UserClientService,
    CourseClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
})
export class CartModule {}
