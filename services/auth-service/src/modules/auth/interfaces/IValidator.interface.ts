import { IUser } from "./IUser.interface";

export interface IValidator {
  validate(user: IUser, data?: any): Promise<void>;
  setNext?(validator: IValidator): IValidator;
}
