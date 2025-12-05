import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { QuizResponse } from './dto/quiz.dto';
import { CreateQuizInput } from './inputs/createQuiz.input';
import { UpdateQuizInput } from './inputs/updateQuiz.input';

@Resolver(() => QuizResponse)
export class QuizResolver {
  constructor(private readonly quizService: QuizService) {}

  @Mutation(() => QuizResponse)
  async createQuiz(
    @Args('input') createQuizInput: CreateQuizInput,
  ): Promise<QuizResponse> {
    return this.quizService.createQuiz(createQuizInput);
  }

  @Mutation(() => QuizResponse)
  async updateQuiz(
    @Args('input') updateQuizInput: UpdateQuizInput,
  ): Promise<QuizResponse> {
    return this.quizService.updateQuiz(updateQuizInput);
  }

  @Mutation(() => QuizResponse)
  async deleteQuiz(@Args('id') id: string): Promise<QuizResponse> {
    return this.quizService.deleteQuiz(id);
  }

  @Query(() => QuizResponse)
  async findQuiz(@Args('id') id: string): Promise<QuizResponse> {
    return this.quizService.findQuiz(id);
  }

  @Query(() => QuizResponse)
  async quizzesByLesson(
    @Args('lessonId') lessonId: string,
  ): Promise<QuizResponse> {
    return this.quizService.getQuizzesByLessonId(lessonId);
  }
}
