import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../guard/role.guard';

export function Auth(permissions: string[] = []) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(RoleGuard),
  );
}
