import { Component, Input, OnInit, inject, signal } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { firstValueFrom } from 'rxjs'
import { TranslocoPipe } from '@jsverse/transloco'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import { RichEditorComponent } from '@app/shared/components/rich-editor/rich-editor.component'
import { DetailHeaderComponent } from '@app/shared/components/detail-header/detail-header.component'
import { Icon } from '@app/shared/icon.enum'
import { color } from '@app/core/constants/colors'
import { LessonService } from '@app/features/lessons/services/lesson.service'
import type { Lesson } from '@app/features/lessons/models/lesson.model'

/**
 * Página da aula (rota `/courses/:id/lessons/:lessonId`). Mostra o conteúdo
 * completo da aula renderizado; o botão "Editar" troca a área por um editor
 * WYSIWYG (app-rich-editor / Jodit) na mesma página e salva via PATCH.
 *
 * `id` (curso) e `lessonId` chegam pela rota via withComponentInputBinding.
 */
@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RichEditorComponent,
    TranslocoPipe,
    ButtonComponent,
    DetailHeaderComponent,
  ],
  templateUrl: './lesson-detail.component.html',
})
export class LessonDetailComponent implements OnInit {
  private readonly lessonService = inject(LessonService)
  private readonly sanitizer = inject(DomSanitizer)

  readonly Icon = Icon
  readonly color = color

  /** Vem da rota `/courses/:id/...` — usado só pro link de voltar. */
  @Input() id?: string
  /** Vem da rota `.../lessons/:lessonId`. */
  @Input() lessonId?: string

  readonly lesson = signal<Lesson | null>(null)
  readonly loading = signal(true)
  readonly error = signal<string | null>(null)
  readonly editing = signal(false)
  readonly saving = signal(false)

  /** Rascunho do conteúdo enquanto está em edição (HTML). */
  readonly contentCtrl = new FormControl('', { nonNullable: true })

  async ngOnInit(): Promise<void> {
    if (!this.lessonId) return
    try {
      const lesson = await firstValueFrom(this.lessonService.getById(this.lessonId))
      this.lesson.set(lesson)
    } catch (err) {
      this.error.set((err as Error).message)
    } finally {
      this.loading.set(false)
    }
  }

  get backLink(): unknown[] {
    return this.id ? ['/courses', this.id] : ['/courses']
  }

  get content(): string {
    return this.lesson()?.content ?? ''
  }

  /**
   * HTML da aula para exibição. bypassSecurityTrustHtml preserva o `style`
   * inline do editor (font-size em px) — o sanitizer do Angular removeria.
   * Conteúdo é escrito só por staff autenticado no editor da própria app.
   */
  get safeContent(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.content)
  }

  startEdit(): void {
    this.contentCtrl.setValue(this.content)
    this.editing.set(true)
  }

  cancelEdit(): void {
    this.editing.set(false)
  }

  async save(): Promise<void> {
    if (!this.lessonId) return
    this.saving.set(true)
    try {
      const updated = await firstValueFrom(
        this.lessonService.update(this.lessonId, { content: this.contentCtrl.value }),
      )
      this.lesson.update((l) => (l ? { ...l, content: updated.content } : l))
      this.editing.set(false)
    } finally {
      this.saving.set(false)
    }
  }
}
