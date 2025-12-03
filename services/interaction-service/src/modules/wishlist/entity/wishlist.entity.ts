import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, Index, Unique } from 'typeorm';
import { BaseEntity } from '@bts-soft/core';

@ObjectType()
@Entity('wishlists')
@Unique(['userId', 'courseId'])
@Index(['userId'])
export class Wishlist extends BaseEntity {
  @Field(() => String)
  @Column({ length: 26 })
  userId: string;

  @Field(() => String)
  @Column()
  courseId: string;
}
