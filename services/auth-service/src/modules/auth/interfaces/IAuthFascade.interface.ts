import { AuthResponse } from '../dtos/AuthRes.dto';
import { LoginDto } from '../inputs/Login.dto';
import { CreateUserInput, ProfileInput } from '../inputs/CreateUserData.dto';
import { ResetPasswordDto } from '../inputs/ResetPassword.dto';
import { ChangePasswordDto } from '../inputs/ChangePassword.dto';
import { Role } from '@course-plateform/common';
import { IUser, IUserResponse } from '../interfaces/IUser.interface';
import { AuthUser } from '../entity/auth.entity';

export interface IAuthServiceFacade {
  register(
    createUserInput: CreateUserInput,
    profileInput: ProfileInput,
  ): Promise<AuthResponse>;

  login(loginDto: LoginDto): Promise<AuthResponse>;

  roleBasedLogin(loginDto: LoginDto, role: Role): Promise<AuthResponse>;

  forgotPassword(email: string): Promise<AuthResponse>;

  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<AuthResponse>;

  changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<AuthResponse>;
}
