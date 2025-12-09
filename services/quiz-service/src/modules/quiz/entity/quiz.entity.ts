import { BaseEntity } from '@bts-soft/core';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { QuizQuestion } from 'src/modules/quizDetails/entities/question.entity';
import { QuizAttempt } from 'src/modules/quizDetails/entities/quizAttempts.entity';
import { Entity, Column, Index, Unique, OneToMany } from 'typeorm';

@ObjectType()
@Entity('quizzes')
@Index(['lessonId'])
@Unique(['lessonId'])
export class Quiz extends BaseEntity {
  @Column()
  @Field(() => String)
  lessonId: string;

  @Column({ length: 255 })
  @Field(() => String)
  title: string;

  @Column('text')
  @Field(() => String)
  description: string;

  @Column({ default: 0 })
  @Field(() => Float)
  timeLimit: number;

  @Column({ default: 70 })
  @Field(() => Float)
  passingScore: number;

  @Field(() => Int)
  @Column({ default: 1 })
  maxAttempts: number;

  @Field(() => [QuizQuestion], { nullable: true })
  @OneToMany(() => QuizQuestion, (question) => question.quiz)
  questions: QuizQuestion[];

  @OneToMany(() => QuizAttempt, (attempt) => attempt.quiz)
  attempts: QuizAttempt[];
}
