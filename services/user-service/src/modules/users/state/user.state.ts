import { Role } from '@course-plateform/common';
import { IUserRoleState } from '../interfaces/IUserState.interface';
import { User } from 'src/modules/users/entities/user.entity';

class AdminState implements IUserRoleState {
  async promote(user: User): Promise<User> {
    return user;
  }

  async demote(user: User): Promise<User> {
    user.role = Role.USER;
    return user;
  }
}

class UserState implements IUserRoleState {
  async promote(user: User): Promise<User> {
    user.role = Role.ADMIN;
    return user;
  }

  async demote(user: User): Promise<User> {
    return user;
  }
}

export class UserRoleContext {
  private state: IUserRoleState;

  constructor(user: User) {
    this.setState(user.role);
  }

  private setState(role: Role): void {
    switch (role) {
      case Role.ADMIN:
        this.state = new AdminState();
        break;
      case Role.USER:
        this.state = new UserState();
        break;
      default:
        throw new Error('Invalid role');
    }
  }

  async promote(user: User): Promise<User> {
    return this.state.promote(user);
  }

  async demote(user: User): Promise<User> {
    return this.state.demote(user);
  }
}
