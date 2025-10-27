import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UpdateUserInput } from '../inputs/UpdateUser.dto';

@Injectable()
export class UserFactory {
  static update(user: User, updateUserDto: UpdateUserInput): User {
    Object.assign(user, updateUserDto);
    return user;
  }
}
