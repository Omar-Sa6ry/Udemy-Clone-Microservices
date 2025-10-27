import { UserService } from 'src/modules/users/users.service';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EmailInput, UserIdInput } from './inputs/user.input';
import { User } from './entities/user.entity';
import { CurrentUserDto } from '@bts-soft/core';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';
import { UpdateUserInput } from './inputs/UpdateUser.dto';
import { UpdateProfileInput } from './inputs/UpdateProfile.dto';
import { ProfileResponse } from './dtos/ProfileResponse.dto';
import { Profile } from './entities/profile.entity';
import { UserProfileLoader } from './loader/user.loader';
import {
  UserCountResponse,
  UserResponse,
  UsersResponse,
} from './dtos/UserResponse.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userProfileLoader: UserProfileLoader,
  ) {}

  @Query((returns) => UserResponse)
  @Auth([Permission.VIEW_USER])
  async getUserById(@Args('id') id: UserIdInput): Promise<UserResponse> {
    return await this.userService.findById(id.UserId);
  }

  @Query((returns) => UserResponse)
  @Auth([Permission.VIEW_USER])
  async getUserByEmail(
    @Args('email') email: EmailInput,
  ): Promise<UserResponse> {
    return await this.userService.findByEmail(email.email);
  }

  @Query((returns) => UsersResponse)
  @Auth([Permission.VIEW_USER])
  async getUsers(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<UsersResponse> {
    return await this.userService.findUsers(page, limit);
  }

  @Query((returns) => UsersResponse)
  @Auth([Permission.VIEW_USER])
  async getInstructors(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<UsersResponse> {
    return await this.userService.findInstructors(page, limit);
  }

  @Query((returns) => UserCountResponse)
  @Auth([Permission.VIEW_USER])
  async getInstructorsCount(): Promise<UserCountResponse> {
    return await this.userService.getInstructorsCout();
  }

  @Query((returns) => UserCountResponse)
  @Auth([Permission.VIEW_USER])
  async getUsersCount(): Promise<UserCountResponse> {
    return await this.userService.getUsersCount();
  }

  @Mutation((returns) => UserResponse)
  @Auth([Permission.UPDATE_USER])
  async updateUser(
    @CurrentUser() user: CurrentUserDto,
    @Args('updateUserDto') updateUserDto: UpdateUserInput,
  ): Promise<UserResponse> {
    return this.userService.updateUser(updateUserDto, user.id);
  }

  @Mutation((returns) => ProfileResponse)
  @Auth([Permission.UPDATE_USER])
  async updateProfile(
    @CurrentUser() user: CurrentUserDto,
    @Args('updateUserDto') updateUserDto: UpdateProfileInput,
  ): Promise<ProfileResponse> {
    return this.userService.updateProfile(updateUserDto, user.id);
  }

  @Query((returns) => UserResponse)
  @Auth([Permission.DELETE_USER])
  async deleteUser(@Args('id') id: UserIdInput): Promise<UserResponse> {
    return await this.userService.delete(id.UserId);
  }

  @Mutation((returns) => UserResponse)
  @Auth([Permission.EDIT_USER_ROLE])
  async updateUserRoleToAdmin(
    @Args('id') id: UserIdInput,
  ): Promise<UserResponse> {
    return await this.userService.editUserRole(id.UserId);
  }

  @Query((returns) => UserResponse)
  @Auth([Permission.CREATE_INSTRUCTOR])
  async createInstractor(@Args('id') id: UserIdInput): Promise<UserResponse> {
    return await this.userService.createInstructor(id.UserId);
  }

  // Resolver Fields
  @ResolveField(() => Profile)
  async profile(@Parent() user: User): Promise<Profile> {
    return this.userProfileLoader.batchProfiles.load(user.id);
  }
}
