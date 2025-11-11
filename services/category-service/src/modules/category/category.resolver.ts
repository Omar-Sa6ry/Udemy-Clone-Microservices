import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './entity/category.entity';
import { Auth, Permission } from '@course-plateform/common';
import { CreateCategoryInput } from './inputs/createCategoryr.input';
import { CategoryIdInput, CategoryNameInput } from './inputs/category.input';
import { UpdateCategoryInput } from './inputs/updateCategory.input';
import { CategoriesResponse, CategoryResponse } from '@course-plateform/types';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth([Permission.CREATE_CATEGORY])
  @Mutation(() => CategoryResponse)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => CategoriesResponse)
  async getAllCategories(
    @Args('page', { nullable: true }) page?: number,
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<CategoriesResponse> {
    return this.categoryService.findAll(page, limit);
  }

  @Query(() => CategoriesResponse)
  async getAllCategoriesWithoutPagingation(): Promise<CategoriesResponse> {
    return this.categoryService.findAllWithoutPag();
  }

  @Query(() => CategoryResponse)
  async getCategoryById(
    @Args('id') id: CategoryIdInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.findById(id);
  }

  @Query(() => CategoryResponse)
  async getCategoryByName(
    @Args('name') name: CategoryNameInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.findByName(name);
  }

  @Auth([Permission.UPDATE_CATEGORY])
  @Mutation(() => CategoryResponse)
  async updateCategory(
    @Args('id') id: CategoryIdInput,
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.update(id, updateCategoryInput);
  }

  @Auth([Permission.DELETE_CATEGORY])
  @Mutation(() => CategoryResponse)
  async deleteCategory(
    @Args('id') id: CategoryIdInput,
  ): Promise<CategoryResponse> {
    return this.categoryService.delete(id);
  }
}
