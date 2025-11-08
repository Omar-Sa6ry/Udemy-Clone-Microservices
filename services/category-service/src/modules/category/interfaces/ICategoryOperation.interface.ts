import { Category } from '../entity/category.entity';

export interface ICategoryOperationValidator {
  validate(category: Category | null): Promise<void>;
}
