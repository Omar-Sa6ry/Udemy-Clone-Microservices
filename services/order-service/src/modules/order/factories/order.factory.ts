import { Order } from '../entities/order.entity';

export class OrderFactory {
  static create(
    userId: string,
    amount: number,
    paymentMethod: string,
    currency: string = 'EGP',
  ): Order {
    const order = new Order();

    order.orderNumber = this.generateOrderNumber();

    order.userId = userId;
    order.amount = amount;
    order.paymentMethod = paymentMethod;
    order.currency = currency;

    order.calculateTotalAmount();

    return order;
  }

  private static generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${timestamp}-${random}`;
  }

  static createFromExisting(data: Partial<Order>): Order {
    const order = new Order();
    Object.assign(order, data);
    return order;
  }
}
