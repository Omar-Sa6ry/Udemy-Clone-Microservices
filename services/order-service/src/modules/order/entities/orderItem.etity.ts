import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { Order } from './order.entity';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { IdField } from '@bts-soft/core';

@ObjectType()
@Entity('orderItems')
export class OrderItem {
  @IdField('orderId')
  @Column({ length: 26 })
  @Index()
  orderId: string;

  @IdField('courseId')
  @Column({ length: 26 })
  courseId: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  priceAfterDiscount: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  calculateDiscountedPrice(discountPercentage: number): void {
    this.priceAfterDiscount = this.price * (1 - discountPercentage / 100);
  }
}
