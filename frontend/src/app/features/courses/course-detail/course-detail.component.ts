import { Component, Input, OnInit, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { firstValueFrom } from 'rxjs'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import {
  DetailField,
  DetailsModalComponent,
} from '@app/shared/components/details-modal/details-modal.component'
import { GeneralModalComponent } from '@app/shared/components/general-modal/general-modal.component'
import { Icon } from '@app/shared/icon.enum'
import { CoursesStore } from '@app/features/courses/state/courses.store'
import { UnitService } from '@app/features/units/services/unit.service'
import { LessonService } from '@app/features/lessons/services/lesson.service'
import type { Course, CourseUnitRef } from '@app/features/courses/models/course.model'
import type { Unit, UnitLessonRef } from '@app/features/units/models/unit.model'
import type { Lesson } from '@app/features/lessons/models/lesson.model'

type FormMode = 'unit' | 'lesson'

/**
 * Tela de detalhe do curso (rota `/courses/:id`). Mostra os dados do curso e
 * as unidades como accordions: o header traz o nome e o nº de aulas; ao
 * abrir, busca a unidade por id e lista as aulas (clicar numa aula abre o
 * modal com os dados completos dela).
 *
 * Um único GeneralModal (com formulário nome/descrição) atende tanto
 * "adicionar módulo" quanto "adicionar aula" (ver `formMode`).
 */
@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoPipe,
    ButtonComponent,
    DetailsModalComponent,
    GeneralModalComponent,
  ],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly coursesStore = inject(CoursesStore)
  private readonly unitService = inject(UnitService)
  private readonly lessonService = inject(LessonService)
  private readonly transloco = inject(TranslocoService)

  readonly Icon = Icon

  /** Vem da rota `/courses/:id` (withComponentInputBinding). */
  @Input() id?: string

  readonly course = signal<Course | null>(null)
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)

  /** Unidade completa (descrição + aulas) por id — cache dos accordions abertos. */
  readonly unitDetails = signal<Record<string, Unit>>({})
  readonly loadingUnit = signal<string | null>(null)

  readonly selectedLesson = signal<Lesson | null>(null)
  readonly lessonModalOpen = signal(false)

  // --- formulário de criação (módulo / aula) ---
  readonly formMode = signal<FormMode | null>(null)
  readonly formUnitId = signal<string | null>(null)
  readonly saving = signal(false)
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
  })

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

  get units(): CourseUnitRef[] {
    return this.course()?.units ?? []
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

  get lessonFields(): DetailField[] {
    const lesson = this.selectedLesson()
    if (!lesson) return []
    return [
      { label: this.transloco.translate('lessons.details.name'), value: lesson.name },
      { label: this.transloco.translate('lessons.details.description'), value: lesson.description },
    ]
  }

  get formTitle(): string {
    return this.transloco.translate(this.formMode() === 'lesson' ? 'lessons.add' : 'units.add')
  }

  lessonsOf(unitId: string): UnitLessonRef[] | undefined {
    return this.unitDetails()[unitId]?.lessons
  }

  unitDescription(unitId: string): string | undefined {
    return this.unitDetails()[unitId]?.description
  }

  format(value: unknown): string {
    return value === null || value === undefined || value === '' ? '—' : String(value)
  }

  async onPanelOpened(unitId: string): Promise<void> {
    if (this.unitDetails()[unitId]) return
    await this.loadUnit(unitId)
  }

  async openLesson(ref: UnitLessonRef): Promise<void> {
    this.selectedLesson.set(null)
    this.lessonModalOpen.set(true)
    try {
      this.selectedLesson.set(await firstValueFrom(this.lessonService.getById(ref.id)))
    } catch {
      this.lessonModalOpen.set(false)
    }
  }

  openAddUnit(): void {
    this.form.reset()
    this.formUnitId.set(null)
    this.formMode.set('unit')
  }

  openAddLesson(unitId: string): void {
    this.form.reset()
    this.formUnitId.set(unitId)
    this.formMode.set('lesson')
  }

  closeForm(): void {
    this.formMode.set(null)
  }

  async saveForm(): Promise<void> {
    if (this.form.invalid || !this.id) {
      this.form.markAllAsTouched()
      return
    }

    const { name, description } = this.form.getRawValue()
    const payload = { name, description: description.trim() || undefined }
    this.saving.set(true)
    try {
      if (this.formMode() === 'unit') {
        await firstValueFrom(this.unitService.create({ ...payload, courseId: this.id }))
        this.course.set(await this.coursesStore.getById(this.id))
      } else {
        const unitId = this.formUnitId()
        if (!unitId) return
        await firstValueFrom(this.lessonService.create({ ...payload, unitId }))
        await this.loadUnit(unitId)
        this.bumpLessonsCount(unitId)
      }
      this.formMode.set(null)
    } finally {
      this.saving.set(false)
    }
  }

  private async loadUnit(unitId: string): Promise<void> {
    this.loadingUnit.set(unitId)
    try {
      const unit = await firstValueFrom(this.unitService.getById(unitId))
      this.unitDetails.update((map) => ({ ...map, [unitId]: unit }))
    } finally {
      this.loadingUnit.set(null)
    }
  }

  private bumpLessonsCount(unitId: string): void {
    const count = this.unitDetails()[unitId]?.lessons?.length ?? 0
    this.course.update((course) =>
      course
        ? {
            ...course,
            units: course.units?.map((u) => (u.id === unitId ? { ...u, lessonsCount: count } : u)),
          }
        : course,
    )
  }
}
