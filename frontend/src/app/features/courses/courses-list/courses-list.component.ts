import { Component, OnInit, inject, signal } from '@angular/core'
import { Router } from '@angular/router'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'

import {
  ResourceColumn,
  ResourceListComponent,
} from '@app/shared/components/resource-list/resource-list.component'
import {
  DetailField,
  DetailsModalComponent,
} from '@app/shared/components/details-modal/details-modal.component'
import { CoursesStore } from '@app/features/courses/state/courses.store'
import type { Course } from '@app/features/courses/models/course.model'

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [ResourceListComponent, DetailsModalComponent, TranslocoPipe],
  templateUrl: './courses-list.component.html',
})
export class CoursesListComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly transloco = inject(TranslocoService)
  readonly coursesStore = inject(CoursesStore)

  readonly selected = signal<Course | null>(null)
  readonly detailsOpen = signal(false)

  get columns(): ResourceColumn<Course>[] {
    return [
      { key: 'name', label: this.transloco.translate('courses.columns.name'), clickable: true },
    ]
  }

  ngOnInit(): void {
    this.coursesStore.fetchAll()
  }

  get detailFields(): DetailField[] {
    const course = this.selected()
    if (!course) return []
    return [
      { label: this.transloco.translate('courses.details.name'), value: course.name },
      { label: this.transloco.translate('courses.details.description'), value: course.description },
    ]
  }

  openDetails(course: Course): void {
    this.selected.set(course)
    this.detailsOpen.set(true)
  }

  editCourse(course: Course): void {
    this.router.navigate(['/courses', course.id, 'edit'])
  }

  async removeCourse(course: Course): Promise<void> {
    const message = this.transloco.translate('common.confirmDelete', { name: course.name })
    if (confirm(message)) {
      await this.coursesStore.remove(course.id)
    }
  }

  applySearch(term: string): void {
    this.coursesStore.fetchAll(term)
  }
}
