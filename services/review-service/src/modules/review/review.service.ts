import { ReviewFascade } from './fascade/review.fascade';
import { Injectable } from '@nestjs/common';
import { ReviewProxy } from './proxy/review.proxy';
import { ReviewResponse, ReviewsResponse } from './dto/reviewResponse.dto';
import { CreateReviewInput } from './inputs/createReview.input';
import { UpdateReviewInput } from './inputs/updateReview.input';
import { FindReviewInput } from './inputs/findReview.input';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewProxy: ReviewProxy,
    private readonly reviewFascade: ReviewFascade,
  ) {}

  async createReview(
    studentId: string,
    createReviewInput: CreateReviewInput,
  ): Promise<ReviewResponse> {
    return this.reviewFascade.create(studentId, createReviewInput);
  }

  async updateReview(
    updateReviewInput: UpdateReviewInput,
    studentId: string,
  ): Promise<ReviewResponse> {
    return this.reviewFascade.update(updateReviewInput, studentId);
  }

  async deleteReview(id: string, studentId: string): Promise<ReviewResponse> {
    return this.reviewFascade.delete(id, studentId);
  }

  async findById(id: string): Promise<ReviewResponse> {
    return this.reviewProxy.findById(id);
  }

  async findByAll(findReviewInput?: FindReviewInput): Promise<ReviewsResponse> {
    return this.reviewProxy.findByAll(findReviewInput);
  }
}
