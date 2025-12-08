import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { QuizQuestionOption } from '../entities/option.entity';
import {
  QuizQuestionOptionResponse,
  QuizQuestionOptionsResponse,
} from '../dtos/quizOptionto';

@Injectable()
export class QuestionOptionProxy {
  constructor(
    private readonly i18n: I18nService,

    @InjectRepository(QuizQuestionOption)
    private optionRepository: Repository<QuizQuestionOption>,
  ) {}

  async getOptionById(id: string): Promise<QuizQuestionOptionResponse> {
    const option = await this.optionRepository.findOne({ where: { id } });

    if (!option)
      throw new NotFoundException(await this.i18n.t('quiz.NOT_FOUND_OPTION'));

    return { data: option };
  }

  async getOptionsForQuestion(
    questionId: string,
  ): Promise<QuizQuestionOptionsResponse> {
    const options = await this.optionRepository.find({
      where: { questionId },
    });

    if (options.length === 0)
      throw new NotFoundException(
        await this.i18n.t('quiz.NOT_FOUND_QUESTIONS'),
      );

    return { items: options };
  }
}
