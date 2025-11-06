import { IValidator } from './IValidator.interface';

export interface IValidatorChain extends IValidator {
  setNext(validator: IValidator): IValidator;
}
