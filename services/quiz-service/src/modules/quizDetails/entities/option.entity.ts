import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, Index } from 'typeorm';
import { QuizQuestion } from './question.entity';
import { BaseEntity } from '@bts-soft/core';

@ObjectType()
@Entity('quiz_question_options')
@Index(['questionId'])
export class QuizQuestionOption extends BaseEntity {
  @Column({ length: 26 })
  @Field(() => String)
  questionId: string;

  @Column('text')
  @Field(() => String)
  optionText: string;

  @Column({ default: false })
  @Field(() => String)
  isCorrect: boolean;

  @Column()
  @Field(() => String)
  position: number;

  @ManyToOne(() => QuizQuestion, (question) => question.options)
  question: QuizQuestion;
}
