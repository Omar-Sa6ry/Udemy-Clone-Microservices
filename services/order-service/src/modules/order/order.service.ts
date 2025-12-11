import { NotificationService } from '@bts-soft/core';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cacheable, LogExecution, Retry } from './decorators/caching.decorator';
import { Order } from './entities/order.entity';
import { OrderFactory } from './factories/order.factory';
import { OrderBuilder } from './builders/order.builder';
import {
  AnalyticsObserver,
  EmailNotificationObserver,
  OrderSubject,
} from './observers/order.observer';
import {
  PaymentProcessor,
  PaymentStrategyFactory,
} from './strategies/payment.strategy';
import {
  IOrderRepository,
  OrderRepository,
} from './repositories/order.repository';
import {
  PaymentGateway,
  PaymentMethod,
  PaymentStatus,
} from './enum/order.enum';

@Injectable()
export class OrderService {
  private orderSubject: OrderSubject;
  private paymentProcessor: PaymentProcessor;

  constructor(
    private readonly notificationService: NotificationService,

    @InjectRepository(OrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {
    this.orderSubject = new OrderSubject();
    this.orderSubject.attach(
      new EmailNotificationObserver(notificationService),
    );
    this.orderSubject.attach(new AnalyticsObserver(notificationService));

    this.paymentProcessor = new PaymentProcessor(
      PaymentStrategyFactory.create('stripe'),
    );
  }

  @LogExecution()
  @Cacheable(300)
  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Order with id ${id} not found`);
    }
    return order;
  }

  @LogExecution()
  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new Error(`Order ${orderNumber} not found`);
    }
    return order;
  }

  @LogExecution()
  async getStudentOrders(userId: string): Promise<Order[]> {
    return await this.orderRepository.findByuserId(userId);
  }

  @LogExecution()
  async createSimpleOrder(
    userId: string,
    email: string,
    amount: number,
    paymentMethod: string,
  ): Promise<Order> {
    const order = OrderFactory.create(userId, amount, paymentMethod);

    const savedOrder = await this.orderRepository.createOrder(order);

    await this.orderSubject.notifyOrderCreated(savedOrder, email);

    await this.processOrderPayment(savedOrder, email);

    return savedOrder;
  }

  @LogExecution()
  async createComplexOrder(
    userId: string,
    email: string,
    amount: number,
    paymentMethod: PaymentMethod,
    options?: {
      tax?: number;
      discount?: number;
      currency?: string;
      paymentGateway?: PaymentGateway;
      items?: Array<{ price: number; discount?: number }>;
    },
  ): Promise<Order> {
    const builder = new OrderBuilder()
      .withuserId(userId)
      .withAmount(amount)
      .withPaymentMethod(paymentMethod);

    if (options?.tax) builder.withTax(options.tax);
    if (options?.discount) builder.withDiscount(options.discount);
    if (options?.currency) builder.withCurrency(options.currency);
    if (options?.paymentGateway)
      builder.withPaymentGateway(options.paymentGateway);

    if (options?.items) {
      options.items.forEach((item) =>
        builder.addItem(item.price, item.discount || 0),
      );
    }

    const order = builder.build();
    const savedOrder = await this.orderRepository.createOrder(order);
    this.orderSubject.notifyOrderCreated(savedOrder, email);

    await this.processOrderPayment(savedOrder, email);

    return savedOrder;
  }

  @Retry(3, 1000)
  private async processOrderPayment(
    order: Order,
    email: string,
  ): Promise<void> {
    try {
      const strategy = PaymentStrategyFactory.create(order.paymentGateway);
      this.paymentProcessor.setStrategy(strategy);

      const result = await this.paymentProcessor.process(
        order.totalAmount,
        order.currency,
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
        },
      );

      order.paymentStatus = result.success
        ? PaymentStatus.COMPLETED
        : PaymentStatus.FAILED;

      if (result.success) {
        await this.orderRepository.updateOrder(order);
        await this.orderSubject.notifyOrderCompleted(order, email);
      } else {
        await this.orderRepository.updateOrder(order);
        await this.orderSubject.notifyOrderFailed(order, email);
      }
    } catch (error) {
      order.paymentStatus = PaymentStatus.FAILED;
      await this.orderRepository.updateOrder(order);
      await this.orderSubject.notifyOrderFailed(order, email);
      throw error;
    }
  }

  @LogExecution()
  async cancelOrder(orderId: string, email: string): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error('Only pending orders can be cancelled');
    }

    order.paymentStatus = PaymentStatus.CANCELLED;
    const updatedOrder = await this.orderRepository.updateOrder(order);

    await this.orderSubject.notifyOrderFailed(updatedOrder, email);

    return updatedOrder;
  }

  @LogExecution()
  async refundOrder(
    email: string,
    orderId: string,
    refundAmount?: number,
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);

    if (!order.isRefundable()) {
      throw new Error('Order is not refundable');
    }

    const amount = refundAmount || order.totalAmount;

    const strategy = PaymentStrategyFactory.create(order.paymentGateway);
    this.paymentProcessor.setStrategy(strategy);

    const result = await this.paymentProcessor.refund(
      `payment_${order.id}`,
      amount,
    );

    if (result.success) {
      console.log(`Order ${order.orderNumber} refunded successfully`);
      await this.orderSubject.notifyOrderRefunded(order, email);
    }

    return order;
  }

  @LogExecution()
  async getOrderStatistics(userId?: string): Promise<any> {
    return await this.orderRepository.getOrderStatistics(userId);
  }
}
