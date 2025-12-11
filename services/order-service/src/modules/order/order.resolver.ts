import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { PaymentMethod, PaymentGateway } from './enum/order.enum';
import { ComplexOrderItemInput } from './inputs/complexOrderItem.input';
import { Auth } from '@course-plateform/common';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Auth()
  @Query(() => Order)
  async orderById(@Args('id') id: string) {
    return await this.orderService.getOrderById(id);
  }

  @Auth()
  @Query(() => Order)
  async orderByNumber(@Args('orderNumber') orderNumber: string) {
    return await this.orderService.getOrderByNumber(orderNumber);
  }

  @Auth()
  @Query(() => [Order])
  async studentOrders(@Args('userId') userId: string) {
    return await this.orderService.getStudentOrders(userId);
  }

  @Auth()
  @Query(() => String)
  async orderStatistics(@Args('userId', { nullable: true }) userId?: string) {
    return await this.orderService.getOrderStatistics(userId);
  }

  @Auth()
  @Mutation(() => Order)
  async createSimpleOrder(
    @Args('userId') userId: string,
    @Args('email') email: string,
    @Args('amount') amount: number,
    @Args('paymentMethod') paymentMethod: string,
  ) {
    return await this.orderService.createSimpleOrder(
      userId,
      email,
      amount,
      paymentMethod,
    );
  }

  @Auth()
  @Mutation(() => Order)
  async createComplexOrder(
    @Args('userId') userId: string,
    @Args('email') email: string,
    @Args('amount') amount: number,
    @Args('paymentMethod') paymentMethod: PaymentMethod,
    @Args('tax', { nullable: true }) tax?: number,
    @Args('discount', { nullable: true }) discount?: number,
    @Args('currency', { nullable: true }) currency?: string,
    @Args('paymentGateway', { nullable: true }) paymentGateway?: PaymentGateway,
    @Args('items', { nullable: true, type: () => [ComplexOrderItemInput] })
    items?: { price: number; discount?: number }[],
  ) {
    return await this.orderService.createComplexOrder(
      userId,
      email,
      amount,
      paymentMethod,
      { tax, discount, currency, paymentGateway, items },
    );
  }

  @Auth()
  @Mutation(() => Order)
  async cancelOrder(
    @Args('orderId') orderId: string,
    @Args('email') email: string,
  ) {
    return await this.orderService.cancelOrder(orderId, email);
  }

  @Auth()
  @Mutation(() => Order)
  async refundOrder(
    @Args('email') email: string,
    @Args('orderId') orderId: string,
    @Args('refundAmount', { nullable: true }) refundAmount?: number,
  ) {
    return await this.orderService.refundOrder(email, orderId, refundAmount);
  }
}
