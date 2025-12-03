import {
  Resolver,
  Query,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CurrentUserDto } from '@bts-soft/core';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';
import { CourseIdInput } from '../cart/dtos/courseId.input';
import { WishlistService } from './wishlist.service';
import { CourseDto, UserResponse } from '@course-plateform/types';
import { Wishlist } from './entity/wishlist.entity';
import { WishlistLoader } from './dataloaders/wishlist.dataLoader';
import { FindWishlistInput } from './inputs/findWishlist.input';
import {
  WishlistResponse,
  WishlistsResponse,
} from './dto/wishlistResponse.dto';

@Resolver(() => Wishlist)
export class WishlistResolver {
  constructor(
    private readonly relationsLoader: WishlistLoader,
    private readonly wishlistService: WishlistService,
  ) {}

  @Auth([Permission.CREATE_WISHLIST])
  @Mutation(() => WishlistResponse)
  async createWishlist(
    @Args('courseIdInput') courseIdInput: CourseIdInput,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<WishlistResponse> {
    return this.wishlistService.create(courseIdInput, user.id);
  }

  @Auth([Permission.DELETE_WISHLIST])
  @Mutation(() => WishlistResponse)
  async deleteWishlist(
    @Args('wishlistId') wishlistId: string,
  ): Promise<WishlistResponse> {
    return this.wishlistService.delete(wishlistId);
  }

  @Auth([Permission.VIEW_WISHLIST])
  @Query(() => WishlistResponse)
  async findWishlistById(@Args('id') id: string): Promise<WishlistResponse> {
    return this.wishlistService.findById(id);
  }

  @Auth([Permission.VIEW_WISHLIST])
  @Query(() => WishlistsResponse)
  async findAllWishlists(
    @Args('findWishlistInput', { nullable: true })
    findWishlistInput?: FindWishlistInput,
    @Args('page', { nullable: true }) page?: number,
    @Args('limit', { nullable: true }) limit?: number,
  ): Promise<WishlistsResponse> {
    return this.wishlistService.findAll(findWishlistInput, page, limit);
  }

  @Auth([Permission.VIEW_WISHLIST])
  @Query(() => WishlistsResponse)
  async findAllWishlistsWithoutPag(
    @Args('findWishlistInput', { nullable: true })
    findWishlistInput?: FindWishlistInput,
  ): Promise<WishlistsResponse> {
    return this.wishlistService.findAllWithPagination(findWishlistInput);
  }

  @ResolveField(() => UserResponse)
  async user(@Parent() wishlist: Wishlist): Promise<UserResponse> {
    return this.relationsLoader.batchUsers.load(wishlist.userId);
  }

  @ResolveField(() => CourseDto)
  async course(@Parent() wishlist: Wishlist): Promise<CourseDto> {
    return this.relationsLoader.batchCourses.load(wishlist.courseId);
  }
}
