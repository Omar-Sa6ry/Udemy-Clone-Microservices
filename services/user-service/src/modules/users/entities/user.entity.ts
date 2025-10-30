import {
  BaseEntity,
  CapitalTextField,
  EmailField,
  PhoneField,
} from '@bts-soft/core';
import { ObjectType, Field } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Profile } from './profile.entity';
import { Role } from '@course-plateform/common';
import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  BeforeUpdate,
  Check,
  OneToOne,
} from 'typeorm';

@ObjectType()
@Entity('users')
@Index(['email', 'id', 'phone'])
export class User extends BaseEntity {
  @Field(() => String)
  @Column({ length: 100, nullable: true })
  @CapitalTextField('firstName')
  firstName?: string;

  @Field(() => String)
  @Column({ length: 100, nullable: true })
  @CapitalTextField('lastName')
  lastName?: string;

  @Field(() => String)
  @Column({ length: 201, nullable: true })
  fullName?: string;

  @Field(() => String)
  @Column({ unique: true })
  @PhoneField()
  phone: string;

  @Field(() => String)
  @Column({ unique: true })
  @PhoneField()
  whatsapp: string;

  @Column({ unique: true })
  @EmailField()
  email: string;

  @Exclude()
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, (Profile) => Profile.user, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  profile?: Profile;

  @BeforeInsert()
  @BeforeUpdate()
  updateFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
