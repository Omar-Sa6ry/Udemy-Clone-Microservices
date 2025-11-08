import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, CapitalTextField, TextField } from '@bts-soft/core';
import { Column, Entity, Index } from 'typeorm';

@ObjectType()
@Entity('categories')
export class Category extends BaseEntity {
  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  @CapitalTextField('Category name', 0, 100, false)
  @Index()
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  @TextField('Category Description', 200)
  description: string;
}
