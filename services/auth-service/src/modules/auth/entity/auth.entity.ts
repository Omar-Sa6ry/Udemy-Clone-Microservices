import { ObjectType, Field, HideField } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Entity, Column, Index, Check } from 'typeorm';
import { BaseEntity } from '@bts-soft/core';

@ObjectType()
@Entity('auth_users')
@Index(['userId'])
@Check(`("password" IS NOT NULL) OR ("googleId" IS NOT NULL)`)
export class AuthUser extends BaseEntity {
  @Field(() => String)
  @Column({ unique: true, length: 26 })
  userId: string;

  @HideField()
  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Exclude()
  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Exclude()
  @Column({ nullable: true })
  resetToken?: string;

  @Exclude()
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date | null;
}
