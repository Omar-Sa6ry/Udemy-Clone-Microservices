import { BaseEntity, IdField } from '@bts-soft/core';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { OrderItem } from './orderItem.etity';
import { PaymentStatus } from '@course-plateform/common';
import { PaymentGateway } from '../enum/order.enum';

@ObjectType()
@Entity('orders')
export class Order extends BaseEntity {
  @Field(() => String)
  @Column({ unique: true, length: 50 })
  orderNumber: string;

  @IdField('userId')
  @Column({ length: 26 })
  @Index()
  userId: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  tax: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  discount: number;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Field(() => String)
  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Field(() => String)
  @Column({ length: 50 })
  paymentMethod: string;

  @Field(() => PaymentStatus)
  @Column({
    type: 'enum',
    enum: PaymentGateway,
    default: PaymentGateway.STRIPE,
  })
  paymentGateway: PaymentGateway;

  @Field(() => PaymentStatus)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  calculateTotalAmount(): void {
    this.totalAmount = this.amount + this.tax - this.discount;
  }

  isRefundable(): boolean {
    return (
      this.paymentStatus === PaymentStatus.COMPLETED &&
      new Date().getTime() - this.createdAt.getTime() < 30 * 24 * 60 * 60 * 1000
    );
  }
}
