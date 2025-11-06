import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './dtos/AuthRes.dto';
import { CreateUserInput, ProfileInput } from './inputs/CreateUserData.dto';
import { LoginDto } from './inputs/Login.dto';
import { ResetPasswordDto } from './inputs/ResetPassword.dto';
import { ChangePasswordDto } from './inputs/ChangePassword.dto';
import { CurrentUserDto } from '@bts-soft/core';
import { AuthUser } from './entity/auth.entity';
import { Auth, CurrentUser, Permission } from '@course-plateform/common';

@Resolver(() => AuthUser)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @Args('profileInput') profileInput: ProfileInput,
  ): Promise<AuthResponse> {
    return this.authService.register(createUserInput, profileInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Mutation(() => AuthResponse)
  @Auth([Permission.FORGOT_PASSWORD])
  async forgotPassword(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<AuthResponse> {
    return this.authService.forgotPassword(user.email);
  }

  @Mutation(() => AuthResponse)
  @Auth([Permission.RESET_PASSWORD])
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => AuthResponse)
  @Auth([Permission.CHANGE_PASSWORD])
  async changePassword(
    @CurrentUser() user: CurrentUserDto,
    @Args('changePasswordDto') changePasswordDto: ChangePasswordDto,
  ): Promise<AuthResponse> {
    return this.authService.changePassword(user?.id, changePasswordDto);
  }

  // @Mutation(() => LogoutResponse)
  // @Auth([Permission.LOGOUT])
  // async logout(@Context('req') req): Promise<LogoutResponse> {
  //   const token = req.headers.authorization?.replace('Bearer ', '');
  //   if (!token) throw new Error(await this.i18n.t('user.NO_TOKEN'));
  //   return {
  //     success: true,
  //     statusCode: 200,
  //     message: 'Logout successful',
  //     timeStamp: new Date().toISOString().split('T')[0],
  //   };
  // }
}
