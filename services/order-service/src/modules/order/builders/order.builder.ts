import { PaymentGateway, PaymentStatus } from '@course-plateform/common';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.etity';

export class OrderBuilder {
  private order: Order;
  private items: OrderItem[] = [];

  constructor() {
    this.order = new Order();
    this.order.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.order.paymentStatus = PaymentStatus.PENDING;
    this.order.currency = 'EGP';
    this.order.tax = 0;
    this.order.discount = 0;
  }

  withuserId(userId: string): this {
    this.order.userId = userId;
    return this;
  }

  withAmount(amount: number): this {
    this.order.amount = amount;
    return this;
  }

  withPaymentMethod(method: string): this {
    this.order.paymentMethod = method;
    return this;
  }

  withPaymentGateway(gateway: PaymentGateway): this {
    this.order.paymentGateway = gateway;
    return this;
  }

  withTax(tax: number): this {
    this.order.tax = tax;
    return this;
  }

  withDiscount(discount: number): this {
    this.order.discount = discount;
    return this;
  }

  withCurrency(currency: string): this {
    this.order.currency = currency;
    return this;
  }

  addItem(price: number, discountPercentage: number = 0): this {
    const item = new OrderItem();
    item.price = price;
    item.calculateDiscountedPrice(discountPercentage);
    this.items.push(item);
    return this;
  }

  build(): Order {
    this.order.calculateTotalAmount();

    if (this.items.length > 0) {
      this.order.items = this.items;
      if (!this.order.amount) {
        this.order.amount = this.items.reduce(
          (sum, item) => sum + item.priceAfterDiscount,
          0,
        );
        this.order.calculateTotalAmount();
      }
    }

    return this.order;
  }
}
