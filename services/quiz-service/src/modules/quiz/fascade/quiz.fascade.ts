import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entity/quiz.entity';
import { QuizResponse } from '../dto/quiz.dto';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { CreateQuizInput } from '../inputs/createQuiz.input';
import { I18nService } from 'nestjs-i18n';
import { QuizProxy } from '../proxy/quiz.proxy';
import { UpdateQuizInput } from '../inputs/updateQuiz.input';

@Injectable()
export class QuizFascade {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    private readonly i18n: I18nService,
    private readonly quizProxy: QuizProxy,
    private readonly courseProxy: CourseClientService,
  ) {}

  async createQuiz(createQuizInput: CreateQuizInput): Promise<QuizResponse> {
    const { lessonId, sectionId, courseId } = createQuizInput;

    await this.quizProxy.existedData(lessonId, courseId, sectionId);

    const quiz = this.quizRepository.create(createQuizInput);
    this.quizRepository.save(quiz);

    return {
      statusCode: 201,
      data: quiz,
      message: this.i18n.t('quiz.CREATED'),
    };
  }

  async updateQuiz(udateQuizInput: UpdateQuizInput): Promise<QuizResponse> {
    const quiz = await this.quizProxy.getQuizById(udateQuizInput.id);
    if (udateQuizInput.lessonId)
      await this.quizProxy.existedData(
        udateQuizInput.lessonId,
        udateQuizInput.courseId || 'lll',
        udateQuizInput.sectionId || 'lll',
      );

    await this.quizRepository.update(udateQuizInput.id, udateQuizInput);

    return { data: quiz.data, message: this.i18n.t('quiz.UPDATED') };
  }

  async deleteQuiz(id: string): Promise<QuizResponse> {
    await this.quizProxy.getQuizById(id);
    await this.quizRepository.delete(id);
    return { data: null, message: this.i18n.t('quiz."DELETE') };
  }
}
