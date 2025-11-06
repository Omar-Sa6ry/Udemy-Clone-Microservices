import { randomBytes } from 'crypto';

export class PasswordResetLinkBuilder {
  private token: string;
  private baseUrl = 'http://localhost:3002/graphql/reset-password';

  constructor() {
    this.token = randomBytes(32).toString('hex');
  }

  getToken(): string {
    return this.token;
  }

  build(): string {
    return `${this.baseUrl}?token=${this.token}`;
  }
}
