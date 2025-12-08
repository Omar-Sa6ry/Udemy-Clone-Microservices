import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestionResponse } from '../dtos/quizQuestiondto';
import { I18nService } from 'nestjs-i18n';
import { QuizQuestionOptionResponse } from '../dtos/quizOptionto';
import { QuestionProxy } from '../proxy/quizQuestion.proxy';
import { CreateQuizQuestionOptionInput } from '../inputs/createOption.input';
import { QuizQuestionOption } from '../entities/option.entity';
import { UpdateQuestionOptionInput } from '../inputs/updateOption.input';
import { QuestionOptionProxy } from '../proxy/questionOption.proxy';

@Injectable()
export class QuizQuestionOptionFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly questionProxy: QuestionProxy,
    private readonly questionOptionProxy: QuestionOptionProxy,

    @InjectRepository(QuizQuestionOption)
    private optionRepository: Repository<QuizQuestionOption>,
  ) {}

  async addOptionToQuestion(
    createQuizQuestionOptionInput: CreateQuizQuestionOptionInput,
  ): Promise<QuizQuestionOptionResponse> {
    await this.questionProxy.getQuestionById(
      createQuizQuestionOptionInput.questionId,
    );

    const option = await this.optionRepository.create(
      createQuizQuestionOptionInput,
    );

    await this.optionRepository.save(option);

    return {
      data: option,
      statusCode: 201,
      message: this.i18n.t('quiz.CREATED_OPTIONS'),
    };
  }

  async updateOptionToQuestion(
    updateQuestionOptionInput: UpdateQuestionOptionInput,
  ): Promise<QuizQuestionOptionResponse> {
    await this.questionOptionProxy.getOptionById(updateQuestionOptionInput.id);

    const option = await this.optionRepository.update(
      updateQuestionOptionInput.id,
      updateQuestionOptionInput,
    );

    return {
      data: option.raw,
      statusCode: 201,
      message: this.i18n.t('quiz.UPDATE_OPTIONS'),
    };
  }

  async deleteOptionQuestionToQuiz(id: string): Promise<QuizQuestionResponse> {
    const option = await this.questionOptionProxy.getOptionById(id);

    this.optionRepository.remove(option.data);

    return {
      data: null,
      statusCode: 201,
      message: this.i18n.t('quiz.DELETE_QUESTION_OPTION'),
    };
  }
}
