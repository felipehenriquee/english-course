import { Injectable } from '@angular/core'

import { BaseService } from '@app/core/services/base.service'
import type {
  CreateLessonPayload,
  Lesson,
  UpdateLessonPayload,
} from '@app/features/lessons/models/lesson.model'

/**
 * Service da feature "lessons". CRUD via BaseService no endpoint `/lessons`.
 * `getAll({ unitId })` lista as aulas de uma unidade.
 */
@Injectable({ providedIn: 'root' })
export class LessonService extends BaseService<Lesson, CreateLessonPayload, UpdateLessonPayload> {
  protected override resource = '/lessons'
}
