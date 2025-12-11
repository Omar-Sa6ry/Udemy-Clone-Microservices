import { Repository, EntityRepository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/orderItem.etity';

export interface IOrderRepository {
  createOrder(order: Order): Promise<Order>;
  updateOrder(order: Order): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findByuserId(userId: string): Promise<Order[]>;
  findOrdersByCourse(courseId: string): Promise<Order[]>;
  getOrderStatistics(userId?: string): Promise<OrderStatistics>;
}

export interface OrderStatistics {
  totalOrders: number;
  totalAmount: number;
  averageOrderValue: number;
  pendingOrders: number;
  completedOrders: number;
}

@EntityRepository(Order)
export class OrderRepository
  extends Repository<Order>
  implements IOrderRepository
{
  async createOrder(order: Order): Promise<Order> {
    const savedOrder = await this.save(order);

    if (order.items && order.items.length > 0) {
      const orderItemRepo = this.manager.getRepository(OrderItem);

      for (const item of order.items) {
        item.orderId = savedOrder.id;
        await orderItemRepo.save(item);
      }
    }

    return (await this.findById(savedOrder.id)) as Order;
  }

  async findById(id: string): Promise<Order | null> {
    return await this.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return await this.findOne({
      where: { orderNumber },
      relations: ['items'],
    });
  }

  async findByuserId(userId: string): Promise<Order[]> {
    return await this.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrder(order: Order): Promise<Order> {
    await this.save(order);
    return (await this.findById(order.id)) as Order;
  }

  async deleteOrder(id: string): Promise<void> {
    await super.delete(id);
  }

  async findOrdersByCourse(courseId: string): Promise<Order[]> {
    return await this.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .where('order.courseId = :courseId', { courseId })
      .getMany();
  }

  async getOrderStatistics(userId?: string): Promise<OrderStatistics> {
    const query = this.createQueryBuilder('order');

    if (userId) query.where('order.userId = :userId', { userId });

    const totalOrders = await query.getCount();

    const result = await query
      .select('SUM(order.totalAmount)', 'totalAmount')
      .addSelect('AVG(order.totalAmount)', 'averageAmount')
      .addSelect(
        `
        SUM(CASE WHEN order.payment_status = :pending THEN 1 ELSE 0 END)
      `,
        'pendingOrders',
      )
      .addSelect(
        `
        SUM(CASE WHEN order.payment_status = :completed THEN 1 ELSE 0 END)
      `,
        'completedOrders',
      )
      .setParameters({
        pending: 'pending',
        completed: 'completed',
      })
      .getRawOne();

    return {
      totalOrders,
      totalAmount: parseFloat(result.totalAmount) || 0,
      averageOrderValue: parseFloat(result.averageAmount) || 0,
      pendingOrders: parseInt(result.pendingOrders) || 0,
      completedOrders: parseInt(result.completedOrders) || 0,
    };
  }
}
