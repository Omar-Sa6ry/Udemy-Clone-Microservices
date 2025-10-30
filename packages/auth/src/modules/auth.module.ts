// auth-common.module.ts (في @course-plateform/common)
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RoleGuard } from '../guard/role.guard';
import { StringValue } from 'ms';

@Module({})
export class AuthCommonModule {
  static register(options: { userServiceToken: string }): DynamicModule {
    return {
      module: AuthCommonModule,
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'default_secret',
          signOptions: { expiresIn: process.env.JWT_EXPIRE as StringValue },
        }),
      ],
      providers: [
        RoleGuard,
        {
          provide: 'USER_SERVICE_TOKEN',
          useValue: options.userServiceToken,
        },
      ],
      exports: [RoleGuard, JwtModule],
    };
  }
}
