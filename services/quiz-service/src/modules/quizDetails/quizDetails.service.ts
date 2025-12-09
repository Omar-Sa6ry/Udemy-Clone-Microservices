import { Injectable } from '@nestjs/common';
import { QuizQuestionFascade } from './fascades/quizQuestion.fascade';
import { QuestionProxy } from './proxy/quizQuestion.proxy';
import { QuizQuestionResponse } from './dtos/quizQuestiondto';
import { CreateQuizQuestionInput } from './inputs/createQuizQuestion.input';
import { UpdateQuestionInput } from './inputs/updateQuizQuestion.input';
import { QuestionOptionProxy } from './proxy/questionOption.proxy';
import { QuizQuestionOptionFascade } from './fascades/quizQuestionOption.fascade';
import { QuizQuestionOptionInput } from './inputs/createAnswer.input';
import { QuizAttemptFascade } from './fascades/quizAttempt.fascade';
import { CreateQuizQuestionOptionInput } from './inputs/createOption.input';
import { UpdateQuestionOptionInput } from './inputs/updateOption.input';
import { QuizAttempsProxy } from './proxy/quizAttemps.proxy';
import {
  QuizAttemptResponse,
  QuizAttemptsResponse,
} from './dtos/quizAttempt.dto';
import {
  QuizQuestionOptionResponse,
  QuizQuestionOptionsResponse,
} from './dtos/quizOptionto';

@Injectable()
export class QuizDetailsService {
  constructor(
    private readonly questionProxy: QuestionProxy,
    private readonly quizAttempsProxy: QuizAttempsProxy,
    private readonly questionOptionProxy: QuestionOptionProxy,
    private readonly quizAttemptFascade: QuizAttemptFascade,
    private readonly quizQuestionFascade: QuizQuestionFascade,
    private readonly quizQuestionOptionFascade: QuizQuestionOptionFascade,
  ) {}

  async getQuestionById(id: string): Promise<QuizQuestionResponse> {
    return this.questionProxy.getQuestionById(id);
  }

  async getQuestionByQuestionText(
    questionText: string,
  ): Promise<QuizQuestionResponse> {
    return this.questionProxy.getQuestionByQuestionText(questionText);
  }
  async addQuestionToQuiz(
    createQuizQuestionInput: CreateQuizQuestionInput,
  ): Promise<QuizQuestionResponse> {
    return this.quizQuestionFascade.addQuestionToQuiz(createQuizQuestionInput);
  }

  async updateQuestionToQuiz(
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<QuizQuestionResponse> {
    return this.quizQuestionFascade.updateQuestionToQuiz(updateQuestionInput);
  }

  async deleteQuestionToQuiz(id: string): Promise<QuizQuestionResponse> {
    return this.quizQuestionFascade.deleteQuestionToQuiz(id);
  }
  async getOptionById(id: string): Promise<QuizQuestionOptionResponse> {
    return this.questionOptionProxy.getOptionById(id);
  }

  async getOptionsForQuestion(
    questionId: string,
  ): Promise<QuizQuestionOptionsResponse> {
    return this.questionOptionProxy.getOptionsForQuestion(questionId);
  }

  async addOptionToQuestion(
    createQuizQuestionOptionInput: CreateQuizQuestionOptionInput,
  ): Promise<QuizQuestionOptionResponse> {
    return this.quizQuestionOptionFascade.addOptionToQuestion(
      createQuizQuestionOptionInput,
    );
  }

  async updateOptionToQuestion(
    updateQuestionOptionInput: UpdateQuestionOptionInput,
  ): Promise<QuizQuestionOptionResponse> {
    return this.quizQuestionOptionFascade.updateOptionToQuestion(
      updateQuestionOptionInput,
    );
  }

  async deleteOptionQuestionToQuiz(id: string): Promise<QuizQuestionResponse> {
    return this.quizQuestionOptionFascade.deleteOptionQuestionToQuiz(id);
  }

  async getUserAttempts(
    userId: string,
    quizId?: string,
  ): Promise<QuizAttemptsResponse> {
    return this.quizAttempsProxy.getUserAttempts(userId, quizId);
  }

  async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: QuizQuestionOptionInput[],
    timeSpent: number,
  ): Promise<QuizAttemptResponse> {
    return this.quizAttemptFascade.submitQuizAttempt(
      userId,
      quizId,
      answers,
      timeSpent,
    );
  }
}
