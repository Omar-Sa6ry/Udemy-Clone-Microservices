import { BaseEntity } from '@bts-soft/core';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Quiz } from 'src/modules/quiz/entity/quiz.entity';
import { Entity, Column, ManyToOne, Index } from 'typeorm';

@ObjectType()
@Entity('quiz_attempts')
@Index(['quizId'])
export class QuizAttempt extends BaseEntity {
  @Field()
  @Column({ length: 26 })
  quizId: string;

  @Field()
  @Column({ length: 26 })
  userId: string;

  @Field(() => Float)
  @Column('decimal', { precision: 5, scale: 2 })
  score: number;

  @Field(() => Float)
  @Column()
  timeSpent: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.attempts)
  quiz: Quiz;
}
