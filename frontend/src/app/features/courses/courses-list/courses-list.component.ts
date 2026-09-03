import { Component, OnInit, inject, signal } from '@angular/core'
import { Router } from '@angular/router'

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
  imports: [ResourceListComponent, DetailsModalComponent],
  templateUrl: './courses-list.component.html',
})
export class CoursesListComponent implements OnInit {
  private readonly router = inject(Router)
  readonly coursesStore = inject(CoursesStore)

  readonly columns: ResourceColumn<Course>[] = [{ key: 'name', label: 'Nome', clickable: true }]

  readonly selected = signal<Course | null>(null)
  readonly detailsOpen = signal(false)

  ngOnInit(): void {
    this.coursesStore.fetchAll()
  }

  get detailFields(): DetailField[] {
    const course = this.selected()
    if (!course) return []
    return [
      { label: 'Nome', value: course.name },
      { label: 'Descrição', value: course.description },
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
    if (confirm(`Remover ${course.name}?`)) {
      await this.coursesStore.remove(course.id)
    }
  }

  applySearch(term: string): void {
    this.coursesStore.fetchAll(term)
  }
}
