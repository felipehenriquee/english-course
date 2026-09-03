import { Component, OnInit, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'

import {
  ResourceColumn,
  ResourceListComponent,
} from '@app/shared/components/resource-list/resource-list.component'
import { CoursesStore } from '@app/features/courses/state/courses.store'
import type { Course } from '@app/features/courses/models/course.model'

@Component({
  selector: 'app-courses-list',
  standalone: true,
  imports: [ResourceListComponent, TranslocoPipe],
  templateUrl: './courses-list.component.html',
})
export class CoursesListComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly transloco = inject(TranslocoService)
  readonly coursesStore = inject(CoursesStore)

  get columns(): ResourceColumn<Course>[] {
    return [
      { key: 'name', label: this.transloco.translate('courses.columns.name'), clickable: true },
      { key: 'unitsCount', label: this.transloco.translate('courses.columns.units') },
    ]
  }

  ngOnInit(): void {
    this.coursesStore.fetchAll()
  }

  openCourse(course: Course): void {
    this.router.navigate(['/courses', course.id])
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
