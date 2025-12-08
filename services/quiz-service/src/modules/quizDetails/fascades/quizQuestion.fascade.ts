import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestionResponse } from '../dtos/quizQuestiondto';
import { QuizProxy } from 'src/modules/quiz/proxy/quiz.proxy';
import { I18nService } from 'nestjs-i18n';
import { CreateQuizQuestionInput } from '../inputs/createQuizQuestion.input';
import { QuizQuestion } from '../entities/question.entity';
import { UpdateQuestionInput } from '../inputs/updateQuizQuestion.input';
import { QuestionProxy } from '../proxy/quizQuestion.proxy';

@Injectable()
export class QuizQuestionFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly quizProxy: QuizProxy,
    private readonly QuestionProxy: QuestionProxy,

    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
  ) {}

  async addQuestionToQuiz(
    createQuizQuestionInput: CreateQuizQuestionInput,
  ): Promise<QuizQuestionResponse> {
    await this.quizProxy.getQuizById(createQuizQuestionInput.quizId);
    const question = await this.questionRepository.create(
      createQuizQuestionInput,
    );

    await this.questionRepository.save(question);

    return {
      data: question,
      statusCode: 201,
      message: this.i18n.t('quiz.CREATED_QUESTION'),
    };
  }

  async updateQuestionToQuiz(
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<QuizQuestionResponse> {
    await this.QuestionProxy.getQuestionById(updateQuestionInput.id);

    if (updateQuestionInput.quizId)
      await this.quizProxy.getQuizById(updateQuestionInput.quizId);

    const question = await this.questionRepository.update(
      updateQuestionInput.id,
      updateQuestionInput,
    );

    return {
      data: question.raw,
      statusCode: 201,
      message: this.i18n.t('quiz.UPDATE_QUESTION'),
    };
  }

  async deleteQuestionToQuiz(id: string): Promise<QuizQuestionResponse> {
    const question = await this.QuestionProxy.getQuestionById(id);

    this.questionRepository.remove(question.data);

    return {
      data: null,
      statusCode: 201,
      message: this.i18n.t('quiz.DELETE_QUESTION'),
    };
  }
}
