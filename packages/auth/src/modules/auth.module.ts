import { RoleGuard } from '../guard/role.guard';
import { StringValue } from 'ms';
import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({})
export class AuthCommonModule {
  static register(options: {
    userService: any;
    imports?: any[];
    providers?: any[];
  }): DynamicModule {
    return {
      module: AuthCommonModule,
      imports: [
        ...(options.imports || []),
        JwtModule.register({
          secret: process.env.JWT_SECRET || 'default_secret',
          signOptions: { expiresIn: process.env.JWT_EXPIRE as StringValue },
        }),
      ],
      providers: [
        RoleGuard,
        ...(options.providers || []),
        {
          provide: 'USER_SERVICE',
          useClass: options.userService,
        },
      ],
      exports: ['USER_SERVICE', JwtModule],
    };
  }
}
