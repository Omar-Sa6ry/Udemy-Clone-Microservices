import { AuthUser } from '../entity/auth.entity';
import { IPasswordResetState } from '../interfaces/IPasswordReset.interface';

export class InitialResetState implements IPasswordResetState {
  async handle(user: AuthUser, token: string): Promise<void> {
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  }
}

export class CompletedResetState implements IPasswordResetState {
  async handle(user: AuthUser): Promise<void> {
    user.resetToken = null;
    user.resetTokenExpiry = null;
  }
}

export class PasswordResetContext {
  private state: IPasswordResetState;

  constructor(initialState: IPasswordResetState) {
    this.state = initialState;
  }

  setState(state: IPasswordResetState): void {
    this.state = state;
  }

  async execute(user: AuthUser, token?: string): Promise<void> {
    if (token) {
      await this.state.handle(user, token);
    } else {
      await (this.state as CompletedResetState).handle(user);
    }
  }
}
