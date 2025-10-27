import { User } from 'src/modules/users/entities/user.entity';

export interface IUserRoleState {
  promote(user: User): Promise<User>;
  demote(user: User): Promise<User>;
}
