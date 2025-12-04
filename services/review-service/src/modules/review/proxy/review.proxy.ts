import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Review } from '../entity/review.entity';
import { FindReviewInput } from '../inputs/findReview.input';
import { ReviewResponse, ReviewsResponse } from '../dto/reviewResponse.dto';
import { Limit, Page } from '@course-plateform/common';

@Injectable()
export class ReviewProxy {
  constructor(
    private readonly i18n: I18nService,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findById(id: string): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });
    if (!review) throw new NotFoundException(this.i18n.t('review.NOT_FOUND'));

    return { data: review };
  }

  async findByAll(
    findReviewInput?: FindReviewInput,
    page: number = Page,
    limit: number = Limit,
  ): Promise<ReviewsResponse> {
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: findReviewInput,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    if (reviews.length === 0)
      throw new NotFoundException(this.i18n.t('review.NOT_FOUNDS'));

    return {
      items: reviews,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkIfExisted(studentId: string, courseId: string) {
    const review = await this.reviewRepository.findOne({
      where: { courseId, studentId },
    });
    if (review) throw new NotFoundException(this.i18n.t('review.EXISTED'));
  }
}
