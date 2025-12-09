import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { QuizQuestionResponse } from './dtos/quizQuestiondto';
import { CreateQuizQuestionInput } from './inputs/createQuizQuestion.input';
import { UpdateQuestionInput } from './inputs/updateQuizQuestion.input';
import { CreateQuizQuestionOptionInput } from './inputs/createOption.input';
import { UpdateQuestionOptionInput } from './inputs/updateOption.input';
import { QuizQuestionOptionInput } from './inputs/createAnswer.input';
import { QuizDetailsService } from './quizDetails.service';
import {
  QuizQuestionOptionResponse,
  QuizQuestionOptionsResponse,
} from './dtos/quizOptionto';
import {
  QuizAttemptResponse,
  QuizAttemptsResponse,
} from './dtos/quizAttempt.dto';

@Resolver()
export class QuizDetailsResolver {
  constructor(private readonly quizDetailsService: QuizDetailsService) {}

  @Query(() => QuizQuestionResponse)
  async getQuestionById(@Args('id') id: string) {
    return this.quizDetailsService.getQuestionById(id);
  }

  @Query(() => QuizQuestionResponse)
  async getQuestionByText(@Args('questionText') questionText: string) {
    return this.quizDetailsService.getQuestionByQuestionText(questionText);
  }

  @Mutation(() => QuizQuestionResponse)
  async addQuestionToQuiz(@Args('input') input: CreateQuizQuestionInput) {
    return this.quizDetailsService.addQuestionToQuiz(input);
  }

  @Mutation(() => QuizQuestionResponse)
  async updateQuestionToQuiz(@Args('input') input: UpdateQuestionInput) {
    return this.quizDetailsService.updateQuestionToQuiz(input);
  }

  @Mutation(() => QuizQuestionResponse)
  async deleteQuestionToQuiz(@Args('id') id: string) {
    return this.quizDetailsService.deleteQuestionToQuiz(id);
  }

  @Query(() => QuizQuestionOptionResponse)
  async getOptionById(@Args('id') id: string) {
    return this.quizDetailsService.getOptionById(id);
  }

  @Query(() => QuizQuestionOptionsResponse)
  async getOptionsForQuestion(@Args('questionId') questionId: string) {
    return this.quizDetailsService.getOptionsForQuestion(questionId);
  }

  @Mutation(() => QuizQuestionOptionResponse)
  async addOptionToQuestion(
    @Args('input') input: CreateQuizQuestionOptionInput,
  ) {
    return this.quizDetailsService.addOptionToQuestion(input);
  }

  @Mutation(() => QuizQuestionOptionResponse)
  async updateOptionToQuestion(
    @Args('input') input: UpdateQuestionOptionInput,
  ) {
    return this.quizDetailsService.updateOptionToQuestion(input);
  }

  @Mutation(() => QuizQuestionResponse)
  async deleteOptionQuestionToQuiz(@Args('id') id: string) {
    return this.quizDetailsService.deleteOptionQuestionToQuiz(id);
  }

  @Query(() => QuizAttemptsResponse)
  async getUserAttempts(
    @Args('userId') userId: string,
    @Args('quizId', { nullable: true }) quizId?: string,
  ) {
    return this.quizDetailsService.getUserAttempts(userId, quizId);
  }

  @Mutation(() => QuizAttemptResponse)
  async submitQuizAttempt(
    @Args('userId') userId: string,
    @Args('quizId') quizId: string,
    @Args({ name: 'answers', type: () => [QuizQuestionOptionInput] })
    answers: QuizQuestionOptionInput[],
    @Args('timeSpent') timeSpent: number,
  ) {
    return this.quizDetailsService.submitQuizAttempt(
      userId,
      quizId,
      answers,
      timeSpent,
    );
  }
}
