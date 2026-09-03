import { Component, Input, OnInit, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import {
  DetailField,
  DetailsModalComponent,
} from '@app/shared/components/details-modal/details-modal.component'
import { CoursesStore } from '@app/features/courses/state/courses.store'
import { UnitService } from '@app/features/units/services/unit.service'
import type { Course, CourseUnitRef } from '@app/features/courses/models/course.model'
import type { Unit } from '@app/features/units/models/unit.model'

/**
 * Tela de detalhe do curso (rota `/courses/:id`). Mesma apresentação que
 * antes ficava no modal de detalhes, agora numa página própria, mais a
 * lista de unidades — clicar numa unidade abre o modal com as infos
 * completas dela.
 */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    TranslocoPipe,
    ButtonComponent,
    DetailsModalComponent,
  ],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  private readonly coursesStore = inject(CoursesStore)
  private readonly unitService = inject(UnitService)
  private readonly transloco = inject(TranslocoService)

  /** Vem da rota `/courses/:id` (withComponentInputBinding). */
  @Input() id?: string

  readonly course = signal<Course | null>(null)
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)

  readonly selectedUnit = signal<Unit | null>(null)
  readonly unitModalOpen = signal(false)

  async ngOnInit(): Promise<void> {
    if (!this.id) return
    try {
      this.course.set(await this.coursesStore.getById(this.id))
    } catch (err) {
      this.error.set((err as Error).message)
    } finally {
      this.loading.set(false)
    }
  }

  get detailFields(): DetailField[] {
    const course = this.course()
    if (!course) return []
    return [
      { label: this.transloco.translate('courses.details.name'), value: course.name },
      { label: this.transloco.translate('courses.details.description'), value: course.description },
      { label: this.transloco.translate('courses.details.units'), value: course.unitsCount },
    ]
  }

  get units(): CourseUnitRef[] {
    return this.course()?.units ?? []
  }

  get unitFields(): DetailField[] {
    const unit = this.selectedUnit()
    if (!unit) return []
    return [
      { label: this.transloco.translate('units.details.name'), value: unit.name },
      { label: this.transloco.translate('units.details.description'), value: unit.description },
    ]
  }

  format(value: unknown): string {
    return value === null || value === undefined || value === '' ? '—' : String(value)
  }

  async openUnit(ref: CourseUnitRef): Promise<void> {
    this.selectedUnit.set(null)
    this.unitModalOpen.set(true)
    try {
      this.selectedUnit.set(await firstValueFrom(this.unitService.getById(ref.id)))
    } catch {
      this.unitModalOpen.set(false)
    }
  }
}
