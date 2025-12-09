import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizProxy } from 'src/modules/quiz/proxy/quiz.proxy';
import { QuizAttempt } from '../entities/quizAttempts.entity';
import { UserClientService } from 'src/modules/user/userClient.service';
import { QuestionType } from '@course-plateform/common';
import { QuizAnswerInput } from '../inputs/createQuizAttempt.input';
import { I18nService } from 'nestjs-i18n';
import { Quiz } from 'src/modules/quiz/entity/quiz.entity';
import { QuizQuestion } from '../entities/question.entity';
import { QuizAttemptResponse } from '../dtos/quizAttempt.dto';
import { QuizQuestionOptionInput } from '../inputs/createAnswer.input';

@Injectable()
export class QuizAttemptFascade {
  constructor(
    private readonly i18n: I18nService,
    private readonly quizProxy: QuizProxy,
    private readonly userProxy: UserClientService,

    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
  ) {}

  async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: QuizQuestionOptionInput[],
    timeSpent: number,
  ): Promise<QuizAttemptResponse> {
    await this.userProxy.findById(userId);
    const quiz = await this.quizProxy.getQuizById(quizId, true);

    const userAttempts = await this.attemptRepository.count({
      where: { quizId, userId },
    });

    if (userAttempts >= quiz.data.maxAttempts)
      throw new BadRequestException(this.i18n.t('quiz.MAX_ATTEMPS'));

    const score = await this.calculateScore(quiz.data, answers);

    const attempt = await this.attemptRepository.create({
      quizId,
      userId,
      score,
      timeSpent,
    });

    this.attemptRepository.save(attempt);

    return {
      data: attempt,
      statusCode: 201,
      message: this.i18n.t('quiz.SUBMIT_QUIZ'),
    };
  }

  private async calculateScore(
    quiz: Quiz,
    answers: QuizQuestionOptionInput[],
  ): Promise<number> {
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers.find((a) => a.questionId === question.id);

      if (userAnswer) {
        const isCorrect = await this.checkAnswer(question, userAnswer);
        if (isCorrect) {
          earnedPoints += question.points;
        }
      }
    }

    return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  }

  private async checkAnswer(
    question: QuizQuestion,
    userAnswer: QuizAnswerInput,
  ): Promise<boolean> {
    switch (question.questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        const correctOptions = question.options.filter((opt) => opt.isCorrect);
        const userSelected = userAnswer.selected_option_ids || [];

        if (correctOptions.length !== userSelected.length) return false;

        return correctOptions.every((correctOpt) =>
          userSelected.includes(correctOpt.id),
        );

      case QuestionType.TRUE_FALSE:
        const correctOption = question.options.find((opt) => opt.isCorrect);
        return (
          correctOption &&
          userAnswer.selected_option_ids?.[0] === correctOption.id
        );

      case QuestionType.SHORT_ANSWER:
        const correctText = question.options.find(
          (opt) => opt.isCorrect,
        )?.optionText;
        return (
          correctText?.toLowerCase() ===
          userAnswer.short_answer_text?.toLowerCase()
        );

      default:
        return false;
    }
  }
}
