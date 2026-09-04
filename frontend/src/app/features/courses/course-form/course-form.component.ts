import { Component, Input, OnInit, inject, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { TranslocoPipe } from '@jsverse/transloco'

import { InputComponent } from '@app/shared/components/input/input.component'
import { CoursesStore } from '@app/features/courses/state/courses.store'
import type { CreateCoursePayload } from '@app/features/courses/models/course.model'

/**
 * Tela de cadastro/edição de curso (rota própria, não dialog).
 * `/courses/new` -> cadastro | `/courses/:id/edit` -> edição.
 * O `id` chega pela rota via withComponentInputBinding (ver app.config.ts).
 */
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    InputComponent,
    MatButtonModule,
    MatIconModule,
    TranslocoPipe,
  ],
  templateUrl: './course-form.component.html',
})
export class CourseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly coursesStore = inject(CoursesStore)

  /** Presente só em /courses/:id/edit. */
  @Input() id?: string

  readonly saving = signal(false)

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
  })

  get isEdit(): boolean {
    return !!this.id
  }

  async ngOnInit(): Promise<void> {
    if (!this.id) return
    const course = await this.coursesStore.getById(this.id)
    this.form.patchValue({ name: course.name, description: course.description ?? '' })
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    this.saving.set(true)
    try {
      const { name, description } = this.form.getRawValue()
      const payload: CreateCoursePayload = { name, description: description.trim() || undefined }
      if (this.id) {
        await this.coursesStore.update(this.id, payload)
      } else {
        await this.coursesStore.create(payload)
      }
      this.router.navigate(['/courses'])
    } finally {
      this.saving.set(false)
    }
  }
}
