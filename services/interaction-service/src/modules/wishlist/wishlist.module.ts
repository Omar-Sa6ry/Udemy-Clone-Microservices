import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entity/wishlist.entity';
import { WishlistService } from './wishlist.service';
import { WishlistFascade } from './fascade/wishlist.fascade';
import { WishlistProxy } from './proxy/wishlist.proxy';
import { WishlistResolver } from './wishlist.resolver';
import { WishlistLoader } from './dataloaders/wishlist.dataLoader';
import { CourseClientService } from '../course/courseClient.service';
import { UserClientService } from '../user/userClient.service';
import { NatsModule } from 'src/common/nats/nats.module';
import { AuthCommonModule } from '@course-plateform/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    WishlistService,
    WishlistFascade,
    WishlistProxy,
    WishlistResolver,
    WishlistLoader,
    CourseClientService,
    UserClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],

  exports: [WishlistProxy, WishlistFascade, TypeOrmModule],
})
export class WishlistModule {}
