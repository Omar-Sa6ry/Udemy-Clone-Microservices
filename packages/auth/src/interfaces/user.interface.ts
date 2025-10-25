export interface IUser {
  id: string;
  email: string;
  role: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}