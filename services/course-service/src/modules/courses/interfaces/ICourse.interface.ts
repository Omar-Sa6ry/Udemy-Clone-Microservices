import { I18nService } from "nestjs-i18n";
import { Course } from "../entity/course.entity";

export interface ICourseHandler {
  setNext(handler: ICourseHandler): ICourseHandler;
  handle(course: Course | null, i18n: I18nService): Promise<void>;
}