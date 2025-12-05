import { Injectable } from '@nestjs/common';
import { QuizProxy } from './proxy/quiz.proxy';
import { QuizFascade } from './fascade/quiz.fascade';
import { CreateQuizInput } from './inputs/createQuiz.input';
import { QuizResponse } from './dto/quiz.dto';
import { UpdateQuizInput } from './inputs/updateQuiz.input';

@Injectable()
export class QuizService {
  constructor(
    private readonly quizProxy: QuizProxy,
    private readonly quizFascade: QuizFascade,
  ) {}

  async createQuiz(createQuizInput: CreateQuizInput): Promise<QuizResponse> {
    return this.quizFascade.createQuiz(createQuizInput);
  }

  async updateQuiz(udateQuizInput: UpdateQuizInput): Promise<QuizResponse> {
    return this.quizFascade.updateQuiz(udateQuizInput);
  }

  async deleteQuiz(id: string): Promise<QuizResponse> {
    return this.quizFascade.deleteQuiz(id);
  }

  async findQuiz(id: string): Promise<QuizResponse> {
    return this.quizProxy.getQuizById(id);
  }

  async getQuizzesByLessonId(lessonId: string): Promise<QuizResponse> {
    return this.quizProxy.getQuizzesByLessonId(lessonId);
  }
}
