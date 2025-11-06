import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { GenerateTokenFactory } from '../jwt/jwt.service';
import { AuthResponse } from '../dtos/AuthRes.dto';
import { LoginDto } from '../inputs/Login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserInput, ProfileInput } from '../inputs/CreateUserData.dto';
import { PasswordServiceAdapter } from '../adapter/password.adapter';
import { Transactional } from 'typeorm-transactional';
import { NotificationService, RedisService } from '@bts-soft/core';
import { UserClientService } from 'src/modules/user/userCclient.service';
import { AuthUser } from '../entity/auth.entity';
import { IAuthServiceFacade } from './../interfaces/IAuthFascade.interface';
import { IUser, IUserResponse } from '../interfaces/IUser.interface';
import { Role } from '@course-plateform/common';
import { PasswordValidator } from '../chain/password.chain';
import { PasswordResetLinkBuilder } from '../builder/PasswordResetLink.builder';
import { ResetPasswordDto } from '../inputs/ResetPassword.dto';
import { ChangePasswordDto } from '../inputs/ChangePassword.dto';
import {
  SendResetPasswordEmailCommand,
  SendWelcomeEmailCommand,
} from '../command/auth.command';
import {
  CompletedResetState,
  InitialResetState,
  PasswordResetContext,
} from '../state/auth.state';
import { console } from 'inspector';

@Injectable()
export class AuthServiceFacade implements IAuthServiceFacade {
  constructor(
    private readonly i18n: I18nService,
    private readonly userService: UserClientService,
    private readonly tokenFactory: GenerateTokenFactory,
    private readonly passwordAdapter: PasswordServiceAdapter,
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationService,
    private readonly passwordValidator: PasswordValidator,
    private readonly passwordStrategy: PasswordServiceAdapter,

    @InjectRepository(AuthUser)
    private readonly userAuthRepo: Repository<AuthUser>,
  ) {}

  @Transactional()
  async register(
    createUserInput: CreateUserInput,
    profileInput: ProfileInput,
  ): Promise<AuthResponse> {
    const user = await this.createUser(createUserInput, profileInput);

    const tokenService = await this.tokenFactory.createTokenGenerator();
    const token = await tokenService.generate(user.email, user.id);

    this.redisService.set(`user:${user.id}`, user);
    this.redisService.set(`user:email:${user.email}`, user);

    const emailCommand = new SendWelcomeEmailCommand(
      this.notificationService,
      user.email,
    );
    emailCommand.execute();

    const cachedUser = await this.redisService.get(`user-count`);
    if (cachedUser)
      this.redisService.setForEever(`user-count`, +cachedUser + 1);

    return {
      data: {
        user,
        token,
      },
    };
  }

  @Transactional()
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const userCacheKey = `auth:${loginDto.email}`;
    const cachedUser = await this.redisService.get(userCacheKey);

    if (cachedUser instanceof AuthResponse) {
      return { ...cachedUser };
    }

    const { email, password } = loginDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));
    this.redisService.set(`user:${user.id}`, user);

    const userAuth = await this.userAuthRepo.findOne({
      where: { userId: user.id },
    });

    if (!userAuth)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    const isValid = await this.passwordAdapter.compare(
      password,
      userAuth.password,
    );
    if (!isValid) throw new BadRequestException('Invalid credentials');

    const tokenGenerator = await this.tokenFactory.createTokenGenerator();
    const token = await tokenGenerator.generate(user.email, user.id);

    return {
      data: { user, token },
      message: await this.i18n.t('user.LOGIN'),
    };
  }

  @Transactional()
  async roleBasedLogin(loginDto: LoginDto, role: Role): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    if (user.role !== role)
      throw new UnauthorizedException(await this.i18n.t('user.NOT_ADMIN'));

    const userAuth = await this.userAuthRepo.findOne({
      where: { id: user.id },
    });
    if (!userAuth)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    await this.passwordValidator.validate(password, userAuth.password);

    const tokenService = await this.tokenFactory.createTokenGenerator();
    const token = await tokenService.generate(user.email, user.id);

    this.userService.save(role, user.id);

    this.redisService.set(`user:${user.id}`, user);
    return {
      data: { user: user, token },
      message: await this.i18n.t('user.LOGIN'),
    };
  }

  @Transactional()
  async forgotPassword(email: string): Promise<AuthResponse> {
    const user = await this.validateUserForPasswordReset(email);

    const userAuth = await this.userAuthRepo.findOne({
      where: { userId: user.id },
    });
    if (!userAuth)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    const builder = new PasswordResetLinkBuilder();
    const link = builder.build();
    const token = builder.getToken();

    console.log('Generated Reset Token:', token);
    const resetContext = new PasswordResetContext(new InitialResetState());
    await resetContext.execute(userAuth, token);
    await this.userAuthRepo.save(userAuth);

    const emailCommand = new SendResetPasswordEmailCommand(
      this.notificationService,
      email,
      link,
    );
    emailCommand.execute();

    return { message: await this.i18n.t('user.SEND_MSG'), data: null };
  }

  @Transactional()
  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthResponse> {
    const userAuth = await this.validateResetToken(resetPasswordDto.token);
    userAuth.password = await this.passwordStrategy.hash(
      resetPasswordDto.password,
    );

    const resetContext = new PasswordResetContext(new CompletedResetState());
    await resetContext.execute(userAuth);

    await this.userAuthRepo.save(userAuth);

    const user = await this.userService.findById(userAuth.userId);
    this.redisService.set(`user:${user.id}`, user);

    return {
      message: await this.i18n.t('user.UPDATE_PASSWORD'),
      data: { user: { ...user }, token: null },
    };
  }

  @Transactional()
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<AuthResponse> {
    if (changePasswordDto.password === changePasswordDto.newPassword)
      throw new BadRequestException(
        await this.i18n.t('user.LOGISANE_PASSWORD'),
      );

    const userAuth = await this.validateUserForPasswordChange(
      id,
      changePasswordDto.password,
    );

    userAuth.password = await this.passwordStrategy.hash(
      changePasswordDto.newPassword,
    );
    await this.userAuthRepo.save(userAuth);

    const user = await this.userService.findById(userAuth.userId);

    return {
      message: await this.i18n.t('user.UPDATE_PASSWORD'),
      data: { user, token: null },
    };
  }

  // ====================== Private helper methods =====================

  private async validateUserForPasswordReset(
    email: string,
  ): Promise<IUserResponse> {
    const user = await this.userService.getUserByEmail(email);

    if ([Role.ADMIN].includes(user.role))
      throw new BadRequestException(await this.i18n.t('user.NOT_ADMIN'));

    return user;
  }

  private async validateResetToken(token: string): Promise<AuthUser> {
    const userAuth = await this.userAuthRepo.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: MoreThan(new Date()),
      },
    });

    if (!userAuth)
      throw new BadRequestException(await this.i18n.t('user.NOT_FOUND'));

    return userAuth;
  }

  private async validateUserForPasswordChange(
    userId: string,
    currentPassword: string,
  ): Promise<AuthUser> {
    const user = await this.userAuthRepo.findOne({ where: { userId } });
    if (!user)
      throw new BadRequestException(await this.i18n.t('user.EMAIL_WRONG'));

    const isMatch = await this.passwordStrategy.compare(
      currentPassword,
      user.password,
    );
    if (!isMatch)
      throw new BadRequestException(await this.i18n.t('user.OLD_IS_EQUAL_NEW'));

    return user;
  }

  private async createUser(
    createUserInput: CreateUserInput,
    profileInput: ProfileInput,
  ): Promise<IUser> {
    await this.userService.dataExisted(
      createUserInput.email,
      createUserInput.phone,
      createUserInput.whatsapp,
    );

    const password = await this.passwordAdapter.hash(createUserInput.password);

    const createdUser = await this.userService.create(
      createUserInput,
      profileInput,
    );

    const userAuth = await this.userAuthRepo.create({
      ...createUserInput,
      userId: createdUser.id,
      password,
    });
    await this.userAuthRepo.save(userAuth);

    return createdUser;
  }
}
