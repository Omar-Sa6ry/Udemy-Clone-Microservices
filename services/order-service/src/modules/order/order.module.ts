import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { NotificationService } from '@bts-soft/core';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.etity';
import { AuthCommonModule } from '@course-plateform/common';
import { UserClientService } from '../user/userClient.service';
import { NatsModule } from 'src/common/nats/nats.module';
import { CourseClientService } from '../course/courseClient.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, OrderRepository]),
    AuthCommonModule.register({
      userService: UserClientService,
      imports: [NatsModule],
    }),
    NatsModule,
  ],
  providers: [
    OrderResolver,
    OrderService,
    NotificationService,
    CourseClientService,
    UserClientService,
    {
      provide: 'USER_SERVICE',
      useExisting: UserClientService,
    },
  ],
  exports: [OrderService],
})
export class OrderModule {}
