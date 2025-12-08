import { BaseEntity } from '@bts-soft/core';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { QuizQuestion } from 'src/modules/quizDetails/entity/question.entity';
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
  time_limit: number;

  @Column({ default: 70 })
  @Field(() => Float)
  passing_score: number;

  @Field()
  @OneToMany(() => QuizQuestion, (question) => question.quiz)
  questions: QuizQuestion[];

  //   @OneToMany(() => QuizAttempt, attempt => attempt.quiz)
  //   attempts: QuizAttempt[];
}
