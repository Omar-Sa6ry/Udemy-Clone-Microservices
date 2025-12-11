import { ChannelType, NotificationService } from '@bts-soft/core';
import { Order } from '../entities/order.entity';

export interface OrderObserver {
  onOrderCreated(order: Order, email: string): Promise<void>;
  onOrderCompleted(order: Order, email: string): Promise<void>;
  onOrderFailed(order: Order, email: string): Promise<void>;
  onOrderRefunded(order: Order, email: string): Promise<void>;
}

export class EmailNotificationObserver implements OrderObserver {
  constructor(private readonly notificationService: NotificationService) {}

  async onOrderCreated(order: Order, email: string): Promise<void> {
    console.log(
      `Sending order confirmation email for order ${order.orderNumber} to student ${order.userId}`,
    );

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: 'Sending order confirmation email for order',
      body: `Sending order confirmation email for order`,
    });
  }

  async onOrderCompleted(order: Order, email: string): Promise<void> {
    console.log(
      `Sending order completion email for order ${order.orderNumber}`,
    );

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Sending order completion email for order ${order.orderNumber}`,
      body: `Sending order completion email for order ${order.orderNumber}`,
    });
  }

  async onOrderFailed(order: Order, email: string): Promise<void> {
    console.log(`Sending order failure email for order ${order.orderNumber}`);

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Sending order failure email for order ${order.orderNumber}`,
      body: `Sending order failure email for order ${order.orderNumber}`,
    });
  }

  async onOrderRefunded(order: Order, email: string): Promise<void> {
    console.log(
      `Sending refund confirmation email for order ${order.orderNumber}`,
    );

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Sending refund confirmation email for order ${order.orderNumber}`,
      body: `Sending refund confirmation email for order ${order.orderNumber}`,
    });
  }
}

export class AnalyticsObserver implements OrderObserver {
  constructor(private readonly notificationService: NotificationService) {}

  async onOrderCreated(order: Order, email: string): Promise<void> {
    console.log(`Tracking order creation in analytics: ${order.orderNumber}`);

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Tracking order creation in analytics: ${order.orderNumber}`,
      body: `Tracking order creation in analytics: ${order.orderNumber}`,
    });
  }

  async onOrderCompleted(order: Order, email: string): Promise<void> {
    console.log(`Tracking order completion in analytics: ${order.orderNumber}`);

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Tracking order completion in analytics: ${order.orderNumber}`,
      body: `Tracking order completion in analytics: ${order.orderNumber}`,
    });
  }

  async onOrderFailed(order: Order, email: string): Promise<void> {
    console.log(`Tracking order failure in analytics: ${order.orderNumber}`);

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Tracking order failure in analytics: ${order.orderNumber}`,
      body: `Tracking order failure in analytics: ${order.orderNumber}`,
    });
  }

  async onOrderRefunded(order: Order, email: string): Promise<void> {
    console.log(`Tracking order refund in analytics: ${order.orderNumber}`);

    this.notificationService.send(ChannelType.EMAIL, {
      recipientId: email,
      subject: `Tracking order refund in analytics: ${order.orderNumber}`,
      body: `Tracking order refund in analytics: ${order.orderNumber}`,
    });
  }
}

export class OrderSubject {
  private observers: OrderObserver[] = [];

  attach(observer: OrderObserver): void {
    this.observers.push(observer);
  }

  detach(observer: OrderObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  async notifyOrderCreated(order: Order, email: string): Promise<void> {
    for (const observer of this.observers) {
      await observer.onOrderCreated(order, email);
    }
  }

  async notifyOrderCompleted(order: Order, email: string): Promise<void> {
    for (const observer of this.observers) {
      await observer.onOrderCompleted(order, email);
    }
  }

  async notifyOrderFailed(order: Order, email: string): Promise<void> {
    for (const observer of this.observers) {
      await observer.onOrderFailed(order, email);
    }
  }

  async notifyOrderRefunded(order: Order, email: string): Promise<void> {
    for (const observer of this.observers) {
      await observer.onOrderRefunded(order, email);
    }
  }
}
