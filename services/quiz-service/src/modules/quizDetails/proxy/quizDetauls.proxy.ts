import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizQuestionResponse } from '../dto/quizQuestiondto';
import { I18nService } from 'nestjs-i18n';
import { QuizQuestion } from '../entity/question.entity';

@Injectable()
export class QuestionProxy {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
  ) {}

  async getQuestionById(id: string): Promise<QuizQuestionResponse> {
    const question = await this.questionRepository.findOne({ where: { id } });

    if (!question)
      throw new NotFoundException(await this.i18n.t('quiz.NOT_FOUND_QUESTION'));

    return { data: question };
  }

  async getQuestionByQuestionText(
    questionText: string,
  ): Promise<QuizQuestionResponse> {
    const question = await this.questionRepository.findOne({
      where: { questionText },
    });

    if (!question)
      throw new NotFoundException(await this.i18n.t('quiz.NOT_FOUND_QUESTION'));

    return { data: question };
  }

  async existedQuestion(questionText: string): Promise<void> {
    const question = await this.questionRepository.findOne({
      where: { questionText },
    });

    if (question)
      throw new NotFoundException(await this.i18n.t('quiz.EXISTED_QUESTION'));
  }
}
