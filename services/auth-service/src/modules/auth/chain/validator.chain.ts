import { I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';
import { Role } from '@course-plateform/common';
import { UserResponse } from '@course-plateform/types';

export interface ValidationContext {
  email?: string;
  password?: string;
  userId?: string;
  requiredRole?: Role;
}

export interface IValidator {
  validate(context: ValidationContext): Promise<UserResponse>;
}

@Injectable()
export class ValidatorChain {
  private validators: IValidator[] = [];

  constructor(private readonly i18n: I18nService) {}

  addValidator(validator: IValidator): this {
    this.validators.push(validator);
    return this;
  }

  async validate(context: ValidationContext): Promise<UserResponse> {
    let result: UserResponse;

    for (const validator of this.validators) {
      result = await validator.validate(context);
    }

    return result;
  }
}