import { AuthUser } from "../entity/auth.entity";

export interface IPasswordResetState {
  handle(user: AuthUser, token: string): Promise<void>;
}
