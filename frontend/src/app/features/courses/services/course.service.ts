import { Injectable } from '@angular/core'

import { BaseService } from '@app/core/services/base.service'
import type {
  Course,
  CreateCoursePayload,
  UpdateCoursePayload,
} from '@app/features/courses/models/course.model'

/**
 * Service da feature "courses". Feature CRUD "convencional": só estende o
 * BaseService apontando para o endpoint. getAll/getById/create/update/delete
 * já vêm prontos e tipados como Course.
 */
@Injectable({ providedIn: 'root' })
export class CourseService extends BaseService<Course, CreateCoursePayload, UpdateCoursePayload> {
  protected override resource = '/courses'
}
