import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from '../entity/course.entity';
import { UpdateCourseInput } from '../inputs/updateCourse.input';
import { ICourseStrategy } from '../interfaces/ICourseStratgy.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class UpdateCourseStrategy implements ICourseStrategy {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async execute(input: UpdateCourseInput): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { _id: new ObjectId(input.id) },
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${input.id} not found`);
    }

    Object.assign(course, input);

    const updatedCourse = await course.save();

    return updatedCourse;
  }
}
