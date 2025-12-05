import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entity/quiz.entity';
import { CourseClientService } from 'src/modules/course/courseClient.service';
import { I18nService } from 'nestjs-i18n';
import { QuizResponse } from '../dto/quiz.dto';

@Injectable()
export class QuizProxy {
  constructor(
    @InjectRepository(Quiz)
    private readonly quizRepository: Repository<Quiz>,

    private readonly i18n: I18nService,
    private readonly courseProxy: CourseClientService,
  ) {}

  async getQuizById(
    id: string,
    withQuestions: boolean = false,
  ): Promise<QuizResponse> {
    const relations = withQuestions ? ['questions', 'questions.options'] : [];
    const quiz = await this.quizRepository.findOne({
      where: { id },
      relations,
    });

    if (!quiz) throw new NotFoundException(this.i18n.t('quiz.NOT_FOUND'));

    return { data: quiz };
  }

  async getQuizzesByLessonId(lessonId: string): Promise<QuizResponse> {
    const quiz = await this.quizRepository.findOne({
      where: { lessonId },
    });

    if (!quiz) throw new NotFoundException(this.i18n.t('quiz.NOT_FOUND'));

    return { data: quiz };
  }

  async existedData(
    lessonId: string,
    courseId: string,
    sectionId: string,
  ): Promise<void> {
    const existedQuiz = await this.quizRepository.findOne({
      where: { lessonId },
    });
    if (existedQuiz) throw new BadRequestException(this.i18n.t('quiz.EXISTED'));

    const existedLesson = await this.courseProxy.findLessonById({
      courseId,
      id: lessonId,
      sectionId,
    });
    if (!existedLesson)
      throw new NotFoundException(this.i18n.t('quiz.LESSON_NOT_FOUND'));
  }
}
