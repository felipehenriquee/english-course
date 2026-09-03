import { Injectable } from '@angular/core'

import { BaseService } from '@app/core/services/base.service'
import type {
  CreateUnitPayload,
  Unit,
  UpdateUnitPayload,
} from '@app/features/units/models/unit.model'

/**
 * Service da feature "units". CRUD via BaseService no endpoint `/units`.
 * `getAll({ courseId })` lista as unidades de um curso.
 */
@Injectable({ providedIn: 'root' })
export class UnitService extends BaseService<Unit, CreateUnitPayload, UpdateUnitPayload> {
  protected override resource = '/units'
}
