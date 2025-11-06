import {
  BaseEntity,
  CapitalTextField,
  TextField,
  UrlField,
} from '@bts-soft/core';
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
@Entity('profiles')
export class Profile extends BaseEntity {
  @Column({ length: 200 })
  @TextField('bio', 5, 255, true)
  bio: string | null;

  @Column({ length: 100 })
  @CapitalTextField('Headline', 5, 100)
  headline: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  avatar?: string | null;

  @Column({ nullable: true })
  @UrlField(true, true)
  youtube_url?: string | null;

  @Column({ nullable: true })
  @UrlField(true, true)
  website_url?: string | null;

  @Column({ nullable: true })
  @UrlField(true, true)
  linkedin_url?: string | null;

  @Field(() => User)
  @OneToOne(() => User, (User) => User.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
