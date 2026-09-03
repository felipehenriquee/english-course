import { Routes } from '@angular/router'
import { authGuard, guestGuard } from '@app/core/guards/auth.guard'

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('@app/layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/features/auth/login/login.component').then((m) => m.LoginComponent),
      },
    ],
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@app/layouts/default-layout/default-layout.component').then(
        (m) => m.DefaultLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@app/features/home/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('@app/features/users/users-list/users-list.component').then(
            (m) => m.UsersListComponent,
          ),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('@app/features/courses/courses-list/courses-list.component').then(
            (m) => m.CoursesListComponent,
          ),
      },
      {
        path: 'courses/new',
        loadComponent: () =>
          import('@app/features/courses/course-form/course-form.component').then(
            (m) => m.CourseFormComponent,
          ),
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('@app/features/courses/course-detail/course-detail.component').then(
            (m) => m.CourseDetailComponent,
          ),
      },
      {
        path: 'courses/:id/edit',
        loadComponent: () =>
          import('@app/features/courses/course-form/course-form.component').then(
            (m) => m.CourseFormComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('@app/shared/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
]
