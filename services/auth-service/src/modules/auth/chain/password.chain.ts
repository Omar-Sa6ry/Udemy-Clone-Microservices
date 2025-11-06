import { I18nService } from 'nestjs-i18n';
import { IPasswordStrategy } from '../interfaces/IPassword.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PasswordValidator {
  constructor(
    private readonly i18n: I18nService,
    @Inject('IPasswordStrategy')
    private readonly passwordService: IPasswordStrategy,
  ) {}

  async validate(password: string, passwordofUser: string): Promise<void> {
    const isValid = await this.passwordService.compare(
      password,
      passwordofUser,
    );

    if (!isValid)
      throw new BadRequestException(await this.i18n.t('user.INVALID_PASSWORD'));
  }
}
