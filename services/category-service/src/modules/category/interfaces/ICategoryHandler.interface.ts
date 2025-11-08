import { I18nService } from "nestjs-i18n";
import { Category } from "../entity/category.entity";

export interface ICategoryHandler {
  setNext(handler: ICategoryHandler): ICategoryHandler;
  handle(category: Category | null, i18n: I18nService): Promise<void>;
}
