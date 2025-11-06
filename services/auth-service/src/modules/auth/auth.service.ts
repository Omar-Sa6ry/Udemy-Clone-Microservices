import { Injectable } from '@nestjs/common';
import { AuthResponse } from './dtos/AuthRes.dto';
import { AuthServiceFacade } from './fascade/AuthService.facade';
import { CreateUserInput, ProfileInput } from './inputs/CreateUserData.dto';
import { IAuthServiceFacade } from './interfaces/IAuthFascade.interface';
import { LoginDto } from './inputs/Login.dto';
import { Role } from '@course-plateform/common';
import { ResetPasswordDto } from './inputs/ResetPassword.dto';
import { ChangePasswordDto } from './inputs/ChangePassword.dto';

@Injectable()
export class AuthService implements IAuthServiceFacade {
  constructor(private readonly authFacade: AuthServiceFacade) {}

  async register(
    createUserInput: CreateUserInput,
    profileInput: ProfileInput,
  ): Promise<AuthResponse> {
    return this.authFacade.register(createUserInput, profileInput);
  }

  async login(loginDto: any): Promise<AuthResponse> {
    return this.authFacade.login(loginDto);
  }

  async roleBasedLogin(loginDto: LoginDto, role: Role): Promise<AuthResponse> {
    return this.authFacade.roleBasedLogin(loginDto, role);
  }

  async forgotPassword(email: string): Promise<AuthResponse> {
    return this.authFacade.forgotPassword(email);
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<AuthResponse> {
    return this.authFacade.changePassword(id, changePasswordDto);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponse> {
    return this.authFacade.resetPassword(resetPasswordDto);
  }
}
