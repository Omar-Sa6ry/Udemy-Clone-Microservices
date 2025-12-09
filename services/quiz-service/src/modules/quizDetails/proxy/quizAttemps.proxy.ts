import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { QuizAttemptsResponse } from '../dtos/quizAttempt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizAttempt } from '../entities/quizAttempts.entity';

@Injectable()
export class QuizAttempsProxy {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
  ) {}
  async getUserAttempts(
    userId: string,
    quizId?: string,
  ): Promise<QuizAttemptsResponse> {
    const where: any = { userId };

    if (quizId) where.quizId = quizId;

    const items = await this.attemptRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['quiz'],
    });

    if (items.length === 0)
      throw new NotFoundException(this.i18n.t('quiz.NO_ATTEMPS_FOUND'));

    return { items };
  }
}
