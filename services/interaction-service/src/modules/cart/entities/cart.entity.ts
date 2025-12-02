import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '@bts-soft/core';
import { CartItem } from './cartItem.enitty';
import { Column, Entity, Index, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Cart extends BaseEntity {
  @Column('numeric', { precision: 10, scale: 2, nullable: true })
  @Field(() => Number)
  totalPrice: number;

  @Field(() => String)
  @Column({ length: 26 })
  @Index()
  userId: string;

  @Field(() => [CartItem], { nullable: true })
  @OneToMany(() => CartItem, (CartItem) => CartItem.cart, {
    onDelete: 'SET NULL',
  })
  cartItems: CartItem[];
}
