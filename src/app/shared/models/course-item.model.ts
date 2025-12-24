import {CourseItemType} from '../enums/course-item-type.enum';

export interface CourseItem {
  id: string;
  courseId: string;
  order: number;
  type: CourseItemType
}
