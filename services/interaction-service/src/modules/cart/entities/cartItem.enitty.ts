import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@bts-soft/core';
import { Cart } from './cart.entity';

@Entity()
@ObjectType()
export class CartItem extends BaseEntity {
  @Column('numeric', { precision: 10, scale: 2 })
  @Field(() => Int)
  totalPrice: number;

  @Field()
  @Column({ length: 26 })
  @Index()
  cartId: string;

  @Field(() => String)
  @Column({ length: 26 })
  @Index()
  courseId: string;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.cartItems, {
    onDelete: 'CASCADE',
  })
  cart: Cart;
}
