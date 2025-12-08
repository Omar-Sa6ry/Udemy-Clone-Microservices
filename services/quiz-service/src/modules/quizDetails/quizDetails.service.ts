import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

@Injectable()
export class QuizDetailsService {
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private questionRepository: Repository<QuizQuestion>,
    @InjectRepository(QuizQuestionOption)
    private optionRepository: Repository<QuizQuestionOption>,
    @InjectRepository(QuizAttempt)
    private attemptRepository: Repository<QuizAttempt>,
  ) {}






  async addQuestionToQuiz(quizId: number, data: any): Promise<QuizQuestion> {
    const quiz = await this.getQuizById(quizId);
    const question = this.questionRepository.create({
      ...data,
      quiz_id: quizId,
    });
    
    return await this.questionRepository.save(question);
  }

  async addOptionsToQuestion(questionId: number, options: any[]): Promise<QuizQuestionOption[]> {
    const question = await this.questionRepository.findOne({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID ${questionId} not found`);
    }

    const optionEntities = options.map(option => 
      this.optionRepository.create({
        ...option,
        question_id: questionId,
      })
    );

    return await this.optionRepository.save(optionEntities);
  }

  async submitQuizAttempt(userId: number, quizId: number, answers: any[], timeSpent: number): Promise<QuizAttempt> {
    const quiz = await this.getQuizById(quizId, true);
    
    // Check max attempts
    const userAttempts = await this.attemptRepository.count({
      where: { quiz_id: quizId, user_id: userId },
    });

    if (userAttempts >= quiz.max_attempts) {
      throw new BadRequestException('Maximum attempts reached for this quiz');
    }

    // Calculate score
    const score = await this.calculateScore(quiz, answers);

    // Create attempt record
    const attempt = this.attemptRepository.create({
      quiz_id: quizId,
      user_id: userId,
      score,
      time_spent: timeSpent,
    });

    return await this.attemptRepository.save(attempt);
  }

  private async calculateScore(quiz: Quiz, answers: any[]): Promise<number> {
    let totalPoints = 0;
    let earnedPoints = 0;

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const userAnswer = answers.find(a => a.question_id === question.id);

      if (userAnswer) {
        const isCorrect = await this.checkAnswer(question, userAnswer);
        if (isCorrect) {
          earnedPoints += question.points;
        }
      }
    }

    return totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
  }

  private async checkAnswer(question: QuizQuestion, userAnswer: any): Promise<boolean> {
    switch (question.question_type) {
      case 'multiple_choice':
        const correctOptions = question.options.filter(opt => opt.is_correct);
        const userSelected = userAnswer.selected_option_ids || [];
        
        if (correctOptions.length !== userSelected.length) {
          return false;
        }

        return correctOptions.every(correctOpt =>
          userSelected.includes(correctOpt.id)
        );

      case 'true_false':
        const correctOption = question.options.find(opt => opt.is_correct);
        return correctOption && userAnswer.selected_option_ids?.[0] === correctOption.id;

      case 'short_answer':
        // For short answer, you might want more complex checking
        const correctText = question.options.find(opt => opt.is_correct)?.option_text;
        return correctText?.toLowerCase() === userAnswer.short_answer_text?.toLowerCase();

      default:
        return false;
    }
  }

  async getUserAttempts(userId: number, quizId?: number): Promise<QuizAttempt[]> {
    const where: any = { user_id: userId };
    if (quizId) {
      where.quiz_id = quizId;
    }

    return await this.attemptRepository.find({
      where,
      order: { created_at: 'DESC' },
      relations: ['quiz'],
    });
  }
}