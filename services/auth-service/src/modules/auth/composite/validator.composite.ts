import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IValidator } from '../interfaces/IValidator.interface';
import { PasswordServiceAdapter } from '../adapter/password.adapter';
import { Role } from '@course-plateform/common';
import { IUser } from '../interfaces/IUser.interface';

export class PasswordValidator implements IValidator {
  constructor(
    private readonly i18n: I18nService,
    private readonly passwordService: PasswordServiceAdapter,
    private readonly password: string,
  ) {}

  async validate(user: IUser): Promise<void> {
    
    const isValid = await this.passwordService.compare(
      this.password,
      user.password,
    );
    if (!isValid)
      throw new BadRequestException(await this.i18n.t('user.OLD_IS_EQUAL_NEW'));
  }
}

export class RoleValidator implements IValidator {
  constructor(
    private readonly i18n: I18nService,
    private readonly requiredRole: Role,
  ) {}

  async validate(user: IUser): Promise<void> {
    if (user.role !== this.requiredRole) {
      throw new UnauthorizedException(await this.i18n.t('user.NOT_ADMIN'));
    }
  }
}

export class ValidatorComposite implements IValidator {
  private validators: IValidator[] = [];

  add(validator: IValidator): void {
    this.validators.push(validator);
  }

  async validate(user: IUser): Promise<void> {
    for (const validator of this.validators) {
      await validator.validate(user);
    }
  }
}
