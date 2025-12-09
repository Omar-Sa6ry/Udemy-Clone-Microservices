import { BaseEntity } from '@bts-soft/core';
import { QuestionType } from '@course-plateform/common';
import { Field, ObjectType } from '@nestjs/graphql';
import { Quiz } from 'src/modules/quiz/entity/quiz.entity';
import { Entity, Column, ManyToOne, Index, OneToMany } from 'typeorm';
import { QuizQuestionOption } from './option.entity';

@ObjectType()
@Entity('quiz_questions')
@Index(['quizId'])
export class QuizQuestion extends BaseEntity {
  @Field(() => String)
  @Column()
  quizId: string;

  @Field(() => String)
  @Column('text')
  questionText: string;

  @Field(() => QuestionType)
  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.MULTIPLE_CHOICE,
  })
  questionType: QuestionType;

  @Field()
  @Column({ default: 1 })
  points: number;

  @Column()
  @Field()
  position: number;

  @OneToMany(() => QuizQuestionOption, (option) => option.question)
  @Field(() => [QuizQuestionOption], { nullable: true })
  options: QuizQuestionOption[];

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
  quiz: Quiz;
}
